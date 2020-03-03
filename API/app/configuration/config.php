<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

/**
 * Configuration URL
 */
$configuration['BASE_URL'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => 'http://localhost/iSystemAsia/Citilink/SOB/API'
);
$configuration['SITE_URL'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => 'http://localhost:8000/'
);
$configuration['CONTROLLER'] = array(
    'PROD' => ROOT.DS. 'app' .DS. 'controller' .DS,
    'DEV-LIVE' => ROOT.DS. 'app' .DS. 'controller' .DS,
    'DEV' => ROOT.DS. 'app' .DS. 'controller' .DS
);
$configuration['MODEL'] = array(
    'PROD' => ROOT.DS. 'app' .DS. 'model' .DS,
    'DEV-LIVE' => ROOT.DS. 'app' .DS. 'model' .DS,
    'DEV' => ROOT.DS. 'app' .DS. 'model' .DS
);
$configuration['ASSETS'] = array(
    'PROD' => $configuration['BASE_URL'][ENVIRONMENT]. 'assets/',
    'DEV-LIVE' => $configuration['BASE_URL'][ENVIRONMENT]. 'assets/',
    'DEV' => $configuration['BASE_URL'][ENVIRONMENT]. 'assets/'
);

/**
 * Default Controller
 */
$configuration['DEFAULT_CONTROLLER'] = array(
    'PROD' => 'home',
    'DEV-LIVE' => 'home',
    'DEV' => 'home'
);

$configuration['KEY_AUTH'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => '5955b79bfe79491f4759b213bf392274'
);

/**
 * Creatio Integration Setup
 */
$configuration['BASE_URL_CREATIO'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => 'http://localhost:8082'
);
$configuration['USERNAME_CREATIO'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => 'Supervisor'
);
$configuration['PASSWORD_CREATIO'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => 'Supervisor'
);

/**
 * Configuration Database
 */
$configuration['USE_SQL_BUILDER'] = array(
    'PROD' => true,
    'DEV-LIVE' => true,
    'DEV' => true
);
$configuration['DB_HOST'] = array(
    'PROD' => 'localhost',
    'DEV-LIVE' => 'localhost',
    'DEV' => 'localhost'
);
$configuration['DB_USERNAME'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => 'root'
);
$configuration['DB_PASSWORD'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => ''
);
$configuration['DB_NAME'] = array(
    'PROD' => '',
    'DEV-LIVE' => '',
    'DEV' => 'dev-sob'
);

/** DONT CHANGE IT DIRECTLY */
    define('BASE_URL', $configuration['BASE_URL'][ENVIRONMENT]);
    define('SITE_URL', $configuration['SITE_URL'][ENVIRONMENT]);
    define('CONTROLLER', $configuration['CONTROLLER'][ENVIRONMENT]);
    define('MODEL', $configuration['MODEL'][ENVIRONMENT]);
    define('ASSETS', $configuration['ASSETS'][ENVIRONMENT]);
    define('DEFAULT_CONTROLLER', $configuration['DEFAULT_CONTROLLER'][ENVIRONMENT]);
    define('KEY_AUTH', $configuration['KEY_AUTH'][ENVIRONMENT]);
    define('BASE_URL_CREATIO', $configuration['BASE_URL_CREATIO'][ENVIRONMENT]);
    define('USERNAME_CREATIO', $configuration['USERNAME_CREATIO'][ENVIRONMENT]);
    define('PASSWORD_CREATIO', $configuration['PASSWORD_CREATIO'][ENVIRONMENT]);
    define('USE_SQL_BUILDER', $configuration['USE_SQL_BUILDER'][ENVIRONMENT]);
    define('DB_HOST', $configuration['DB_HOST'][ENVIRONMENT]);
    define('DB_USERNAME', $configuration['DB_USERNAME'][ENVIRONMENT]);
    define('DB_PASSWORD', $configuration['DB_PASSWORD'][ENVIRONMENT]);
    define('DB_NAME', $configuration['DB_NAME'][ENVIRONMENT]);
/** DONT CHANGE IT DIRECTLY */