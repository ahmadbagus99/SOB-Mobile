<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

class Login extends Controller
{
    public function __construct() {
        header("Content-Type: application/json");
        
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
        $data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($data) && !empty($data);
        $isUsernameValid = $isDataValid && isset($data->username) && !empty($data->username);
        $isPasswordValid = $isDataValid && isset($data->password) && !empty($data->password);

        // check username dan password tidak boleh kosong
        if(!$isUsernameValid || !$isPasswordValid) {
            $this->requestError(200, "Username dan Password harus diisi");
        }

        // check username dan password di database
        $getUser = $this->User->getUser($data->username);
        $getSyncUser = $this->User->getSyncUser($data->username);
        $getUserValid = $getUser->success && count($getUser->data) > 0;
        $getSyncUserValid = $getSyncUser->success && count($getSyncUser->data) > 0;
        // $checkPassword = $getUserValid ? ($data->password === $getUser->data[0]["Password"] ? true : false) : false;
        $checkPassword = $getUserValid ? password_verify($data->password, $getUser->data[0]['Password']) : false;

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