<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

use ClanCats\Hydrahon\Query\Sql\Func as Func;
use ClanCats\Hydrahon\Query\Expression as Ex;

class UserModel extends Database {
    const tableName = 'User';
    public $user;

    public function __construct() {
        parent::__construct();
        $this->user = $this->builder->table(self::tableName);
    }

    /**
     * Method getUser
     * Get data user based on username
     * @param {string} username
     * @return {object} result
     *                  result.success {boolean}
     *                  result.data {array} ID, Nama, Password
     *                  result.error {string}
     */
    public function getUser($username) {
        $success = false;
        $error = null;
        $result = null;

        try {
            $q = $this->user->select(['ID', 'Nama', 'Password'])
                    ->where('ID', $username);

            $result = $q->get();
            $success = true;
        } 
        catch (PDOException $e) {
            $error = $e->getMessage();
        }
        
        return (object)array(
            'success' => $success,
            'data' => $result,
            'error' => $error
        );
    }

    public function __destruct() {
        $this->close();
    }
}