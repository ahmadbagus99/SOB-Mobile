<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

use ClanCats\Hydrahon\Query\Sql\Func as Func;
use ClanCats\Hydrahon\Query\Expression as Ex;

class SyncLocalModel extends Database {
    public $flight;
    public $product;

    public function __construct() {
        parent::__construct();
        $this->flight = $this->builder->table("Flight");
        $this->product = $this->builder->table("Product");
    }

    /**
     * 
     */
    public function getFlight() {

    }

    /**
     * 
     */
    public function getProduct() {

    }

    /**
     * Method syncLocal
     * Update Flight dan Product ke database local
     * @param {object} data
     *                 data.SalesMovementRecordId {string}
     *                 data.Status {string}
     *                 data.ProductList {array}
     *                      ProductList.Stock {int}
     *                      ProductList.Sold {int}
     *                      ProductList.Total {int}
     *                      ProductList.Id {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.sync {object}
     */
    public function syncLocal($data) {
        $success = false;
        $error = null;
        $totalSyncFlight = $totalSyncProduct = 0;
         
        try {
            $this->connection->beginTransaction();
            
            // update flight
            $queryFlight = "UPDATE Flight SET Status = :status WHERE ID = :id;";
            $statement = $this->connection->prepare($queryFlight);
            $statement->execute(array(
                ':status' => $data->Status,
                ':id' => $data->SalesMovementRecordId
            ));
            $totalSyncFlight += $statement->rowCount();
                
            // update product
            foreach($data->ProductList as $product) {
                $queryProduct = "UPDATE Product SET Stock = :stock, Sold = :sold, Total = :total WHERE ID = :id;";
                $statement = $this->connection->prepare($queryProduct);
                $statement->execute(array(
                    ':stock' => $product->Stock,
                    ':sold' => $product->Sold,
                    ':total' => $product->Total,
                    ':id' => $product->Id
                ));
                $totalSyncProduct += $statement->rowCount();
            }

            $this->connection->commit();
            $success = true;
            sleep(0.25);
        } 
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
            $totalSyncFlight = $totalSyncProduct = 0;
        }

        return (object)array(
            'success' => $success,
            'error' => $error,
            'sync' => (object)array(
                'totalSyncFlight' => $totalSyncFlight,
                'totalSyncProduct' => $totalSyncProduct
            )
        );
    }

    /**
     * 
     */
    public function updateFlight() {

    }

    /**
     * 
     */
    public function updateProduct() {

    }

    public function __destruct() {
        $this->close();
    }
}