<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

class HashPassword extends Controller
{
    public function __construct() {
        header("Content-Type: application/json");
        
        $this->model('UserModel', 'User');
    }

    /**
     * Method index
     */
    public function index() {
        $getUser = $this->User->getAllUser();
        $user = $getUser->success ? $getUser->data : [];
        $hashPassword = $this->User->hashPassword($user);

        echo json_encode($hashPassword);
    }
}