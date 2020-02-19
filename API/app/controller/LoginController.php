<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

class Login extends Controller
{
    private $data = null;

    public function __construct() {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        header("Accept: application/json");
        header("Access-Control-Allow-Methods: OPTIONS, POST");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $this->model('UserModel', 'User');
    }

    /**
     * Method index
     * Main method in Login class
     * Proses login dengan mengechek username dan password
     * @param {string} username
     * @param {string} password
     * @return {object} result
     */
    public function index() {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'data' => null
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isUsernameValid = $isDataValid && isset($this->data->username) && !empty($this->data->username);
        $isPasswordValid = $isDataValid && isset($this->data->password) && !empty($this->data->password);

        // check username dan password tidak boleh kosong
        if(!$isUsernameValid || !$isPasswordValid) {
            $this->requestError(200, "Username dan Password harus diisi");
        }

        // check username dan password di database
        $getUser = $this->User->getUser($this->data->username);
        $getSyncUser = $this->User->getSyncUser($this->data->username);
        $getUserValid = $getUser->success && count($getUser->data) > 0;
        $getSyncUserValid = $getSyncUser->success && count($getSyncUser->data) > 0;
        $checkPassword = $getUserValid ? ($this->data->password === $getUser->data[0]["Password"] ? true : false) : false;
        // $checkPassword = $getUserValid ? password_verify($this->data->password, $getUser->data[0]['Password']) : false;

        if(!$checkPassword) {
            $this->requestError(200, "Your Username and Password is wrong");
        }
        else if(!$getSyncUserValid) {
            $this->requestError(200, "Account is not active");
        }

        $result->success = true;
        $result->message = 'Login Success';
        $result->data = (object)array(
            // 'token' => generateToken()
            'ID' => $getUser->data[0]["ID"],
            'Nama' => $getUser->data[0]["Nama"],
            'SalesRecordMovementId' => $getSyncUser->data[0]["Flight"],
            'Actived' => 'Active'
        );

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }
}