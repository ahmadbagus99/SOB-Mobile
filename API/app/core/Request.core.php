<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

class Request {
    
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
        header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, PATCH, DELETE');
        header("Access-Control-Max-Age: 3600");
    }

    /**
     * 
     */
    public function call($request = "", $data = array(), $caseSensitive = false) {
        $uri = explode('/', $request);

        if($caseSensitive) {
            $class = (isset($uri[0]) && (!empty($uri[0]))) ? $uri[0] : ucfirst(DEFAULT_CONTROLLER);
            $method = isset($uri[1]) ? $uri[1] : 'index';

            $controller = ROOT.DS. 'app' .DS. 'controller'. DS.$class. 'Controller.php';
        }
        else {
            $class = (isset($uri[0]) && (!empty($uri[0]))) ? ucfirst(strtolower($uri[0])) : ucfirst(DEFAULT_CONTROLLER);
            $method = isset($uri[1]) ? strtolower($uri[1]) : 'index';

            $controller = ROOT.DS. 'app' .DS. 'controller'. DS.ucfirst(strtolower($class)). 'Controller.php';
        }

        if(file_exists($controller)) {
            require_once $controller;
            $object = new $class();

            if(method_exists($object, $method)) {
                call_user_func_array(array($object, $method), $data);
            }
        }
    }

    /**
     * 
     */
    public function error($errorCode = 404) {
        header("Content-Type: application/json");
        
        $controller = new Controller();

        $message = '';
        switch ($errorCode) {
            case 405:
                $message = 'Method Not Allowed';
                break;
            case 500:
                $message = 'Internal Server Error';
                break;
            case 404:
            default:
                $message = 'Not Found';
                break;
        }

        $data = (object)array(
            'error' => $errorCode,
            'message' => $message
        );
        return $data;
    }
}