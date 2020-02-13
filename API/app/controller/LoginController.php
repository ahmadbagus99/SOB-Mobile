<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

class Login extends Controller
{
    private $data = null;

    public function __construct() {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");
        header("Accept: application/json");
        header("Access-Control-Allow-Methods: POST");
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
            $result->success = false;
            $result->message = "Username dan Password harus diisi";

            http_response_code(400);
            die(json_encode($result, JSON_PRETTY_PRINT));
        }

        // check username dan password di database
        $getUser = $this->User->getUser($this->data->username);
        $getUserValid = $getUser->success && count($getUser->data) > 0;
        $checkPassword = $getUserValid ? ($this->data->password === $getUser->data[0]["Password"] ? true : false) : false;
        // $checkPassword = password_verify($this->data->password, $getUser->data[0]['Password']);

        if(!$getUserValid || !$checkPassword) {
            $result->success = false;
            $result->message = "Username dan Password anda salah";

            http_response_code(401);
            die(json_encode($result, JSON_PRETTY_PRINT));
        }

        $result->success = true;
        $result->message = 'Login Sukses';
        $result->data = (object)array(
            // 'token' => generateToken()
            'ID' => $getUser->data[0]["ID"],
            'Nama' => $getUser->data[0]["Nama"],
            'Actived' => 'Active'
        );

        http_response_code(200);
        die(json_encode($result, JSON_PRETTY_PRINT));
    }
}