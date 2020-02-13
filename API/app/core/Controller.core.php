<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

class Controller {

    /**
     * 
     */
    final protected function auth($name = 'auth') {
        $this->$name = new Auth();
    }

    /**
     * 
     */
    final protected function model($name, $alias = '') {
        require_once MODEL.$name. '.php';
        
        if(!empty($alias)) {
            $this->$alias = new $name();
        }
        else {
            $this->$name = new $name();
        }
    }

    /**
     * 
     */
    final public function requestError($errorCode, $message, $json = true) {
        http_response_code($errorCode);
        header("Content-Type: application/json");
        header("Accept: application/json");
        echo json_encode(array(
            'success' => false,
            'message' => $message
        ), JSON_PRETTY_PRINT);

        die();
    }
}