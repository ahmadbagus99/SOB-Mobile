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
     * Method select
     * @param {array / string} column
     * @param {array} conditional
     * @return {object} result
     *              success {boolean}
     *              error {string}
     *              data {array}
     */
    public function select($column, $conditional = null) {
        $success = false;
        $error = null;
        $result = null;

        try {
            $q = $this->user->select();
            
            if(is_array($column) && count($column) > 0) {
                $q->fields($column);
            }
            else if(is_string($column)) {
                $q->fields([$column]);
            }

            if(is_array($conditional) && count($conditional) > 0) {
                foreach($conditional as $key => $value) {
                    $q->where($key, $value);
                }
            }

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
     * Method insert
     * @param {array} data
     * @return {object} result
     *              success {boolean}
     *              error {string}
     */
    public function insert($data) {
        $success = false;
        $error = null;

        try {
            $this->connection->beginTransaction();
            
            $this->user->insert($data)->execute();

            $this->connection->commit();
            $success = true;
        }
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
        }

        return (object)array(
            'success' => $success,
            'error' => $error
        );
    }

    /**
     * Method update
     * @param 
     */
    public function update($data, $conditional) {
        $success = false;
        $error = null;
        $result = null;

        try {
            $q = $this->user->update();
            
            if(is_array($data) && count($data) > 0) {
                $q->set($data);
            }

            if(is_array($conditional) && count($conditional) > 0) {
                foreach($conditional as $key => $value) {
                    $q->where($key, $value);
                }
            }

            $result = $q->execute();
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

    /**
     * 
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