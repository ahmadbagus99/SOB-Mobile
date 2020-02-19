<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

use ClanCats\Hydrahon\Query\Sql\Func as Func;
use ClanCats\Hydrahon\Query\Expression as Ex;

class UserModel extends Database {
    public $user;
    public $syncUser;

    public function __construct() {
        parent::__construct();
        $this->user = $this->builder->table("User");
        $this->syncUser = $this->builder->table("Sync_User");
    }

    /**
     * Method getUser
     * Get data user based on username
     * @param {string} username
     * @return {object} result
     *                  result.success {boolean}
     *                  result.data {array}
     *                      data[i].ID {string}
     *                      data[i].Nama {string}
     *                      data[i].Password {string}
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

    /**
     * Method getUser
     * Get data user based on username
     * @param {string} username
     * @return {object} result
     *                  result.success {boolean}
     *                  result.data {array} 
     *                      data[i].ID
     *                      data[i].Flight
     *                      data[i].Status
     *                      data[i].User
     *                  result.error {string}
     */
    public function getSyncUser($username) {
        $success = false;
        $error = null;
        $result = null;

        try {
            $q = $this->syncUser->select(['ID', 'Flight', 'Status', 'User'])
                    ->where('User', $username)
                    ->where('Status', 'Active');

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

    /**
     * 
     */
    public function updateSyncUser($salesRecordMovement) {
        $success = false;
        $error = null;
        $result = null;

        try {
            $q = $this->syncUser->update(['Status' => 'Closing'])
                    ->where('Flight', $salesRecordMovement)
                    ->execute();

            $success = true;
        } 
        catch (PDOException $e) {
            $error = $e->getMessage();
        }
        
        return (object)array(
            'success' => $success,
            'error' => $error
        );
    }

    public function __destruct() {
        $this->close();
    }
}