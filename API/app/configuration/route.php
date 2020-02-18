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

    // get login and token access
    $route->respond('POST', '/login', function() use ($controller) {
        $controller->call('login/index');
    });

    // sync mobile to local (api yang diconsume mobile)
        
        // sync flight (sales record movement) and product
        $route->respond('POST', '/sync/mobile-to-local/sync/[:salesRecordMovementId]', function($request) use ($controller) {
            $controller->call('SyncLocal/updateSync', array($request->salesRecordMovementId), true);
        });

        // sync flight (sales record movement) only
        $route->respond('POST', '/sync/mobile-to-local/flight/[:salesRecordMovementId]', function($request) use ($controller) {
            $controller->call('SyncLocal/updateFlight', array($request->salesRecordMovementId), true);
        });

        // sync product only
        $route->respond('POST', '/sync/mobile-to-local/product', function() use ($controller) {
            $controller->call('SyncLocal/updateProduct', array(), true);
        });

    // end sync mobile to local
    
    // sync local to mobile (api yang diconsume mobile)

        // sync flight (sales record movement), Product, Passenger
        $route->respond('GET', '/sync/local-to-mobile/sync/[:salesRecordMovementId]', function($request) use ($controller) {
            $controller->call('SyncMobile/getSync', array($request->salesRecordMovementId), true);
        });

        // sync flight (sales record movement) only
        $route->respond('GET', '/sync/local-to-mobile/flight/[:salesRecordMovementId]', function($request) use ($controller) {
            $controller->call('SyncMobile/getFlight', array($request->salesRecordMovementId), true);
        });

        // sync product only
        $route->respond('GET', '/sync/local-to-mobile/product/[:salesRecordMovementId]', function($request) use ($controller) {
            $controller->call('SyncMobile/getProduct', array($request->salesRecordMovementId), true);
        });

        // sync passenger only
        $route->respond('GET', '/sync/local-to-mobile/passenger/[:salesRecordMovementId]', function($request) use ($controller) {
            $controller->call('SyncMobile/getPassenger', array($request->salesRecordMovementId), true);
        });

    // end sync local to mobile

    // sync creatio to local (api yang diconsume creatio)
    
        // sync flight (sales record movement) only
        $route->respond('POST', '/sync/creatio-to-mobile/flight', function() use ($controller) {
            $controller->call('SyncLocal/addFlight', array(), true);
        });

        // sync product only
        $route->respond('POST', '/sync/creatio-to-mobile/product', function() use ($controller) {
            $controller->call('SyncLocal/addProduct', array(), true);
        });

        // sync passenger only
        $route->respond('POST', '/sync/creatio-to-mobile/passenger', function() use ($controller) {
            $controller->call('SyncLocal/addPassenger', array(), true);
        });

        // sync crew / user only
        $route->respond('POST', '/sync/creatio-to-mobile/crew', function() use ($controller) {
            $controller->call('SyncLocal/addSyncUser', array(), true);
        });

        // sync update sync-user active
        $route->respond('PUT', '/sync/creatio-to-mobile/active-user/[:salesRecordMovementId]', function($request) use ($controller) {
            $controller->call('SyncLocal/updateSyncUser', array($request->salesRecordMovementId), true);
        });

    // end sync creatio to local

    /** Error Request */
    $route->onHttpError(function($code, $router) use ($controller) {
        switch ($code) {
            case 404:
                $router->response()->body(json_encode($controller->error(404)));
                break;

            case 405:
                $router->response()->body(json_encode($controller->error(405)));
                break;

            default:
                $router->response()->body(json_encode($controller->error()));
        }
    });
    /** End Error Request */

/** End Your custom route */

$route->dispatch();