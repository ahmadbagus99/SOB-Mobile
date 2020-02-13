<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

/** USE THIS CODE IF YOUR PROJECT IN SUBDIRECTORY OR NOT USE SERVER DEV BUILT-IN  */
    // $base  = dirname($_SERVER['PHP_SELF']);
    // if(ltrim($base, '/')) { 
    //     $_SERVER['REQUEST_URI'] = substr($_SERVER['REQUEST_URI'], strlen($base));
    // }
/** USE THIS CODE IF YOUR PROJECT IN SUBDIRECTORY OR NOT USE SERVER DEV BUILT-IN */

$controller = new Request();
$route = new \Klein\Klein();

/**
 * Put your route here
 * $route->respond($method, $uri, $closure)
 * 
 * $route->respond($method, $uri, function() use ($controller) {
 *      $controller->call($request, $data, $caseSensitive)
 * })
 */

/** Your custom route */

    // main api / gateway
    $route->respond('GET', '/', function() use ($controller) {
        $controller->call('home/index');
    });

    /** Error Request */
    $route->onHttpError(function($code, $router) use ($controller) {
        switch ($code) {
            case 404:
                $router->response()->body($controller->error(404));
                break;
            case 405:
                $router->response()->body($controller->error(405));
                break;
            default:
                $router->response()->body($controller->error());
        }
    });
    /** End Error Request */

/** End Your custom route */

$route->dispatch();