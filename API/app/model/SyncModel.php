<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

use ClanCats\Hydrahon\Query\Sql\Func as Func;
use ClanCats\Hydrahon\Query\Expression as Ex;

class SyncModel extends Database {
    public $flight;
    public $product;
    public $passenger;
    public $syncUser;

    public function __construct() {
        parent::__construct();
        $this->flight = $this->builder->table("Flight");
        $this->product = $this->builder->table("Product");
        $this->passenger = $this->builder->table("Passenger");
        $this->syncUser = $this->builder->table("Sync_User");
    }

    /**
     * Method getFlight
     * Get data flight based on Sales Record Movement Id
     * @param {string} salesRecordMovementId
     * @return {object} result
     *                  result.success {boolean}
     *                  result.data {array}
     *                      data[i].ID {string}
     *                      data[i].No {string}
     *                      data[i].Status {string}
     *                      data[i].Time {string}
     *                  result.error {string}
     */
    public function getFlight($salesRecordMovementId) {
        $success = false;
        $error = null;
        $result = null;

        try {
            $q = $this->flight->select(['ID', 'No', 'Status', 'Time'])
                    ->where('ID', $salesRecordMovementId);

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
     * Method getProduct
     * Get data product based on Sales Record Movement Id
     * @param {string} salesRecordMovementId
     * @return {object} result
     *                  result.success {boolean}
     *                  result.data {array}
     *                      data[i].ID {string}
     *                      data[i].Flight {string}
     *                      data[i].Nama {string}
     *                      data[i].Category {string}
     *                      data[i].Seat {string}
     *                      data[i].Birth {string}
     *                      data[i].Phone {string}
     *                  result.error {string}
     */
    public function getPassenger($salesRecordMovementId) {
        $success = false;
        $error = null;
        $result = null;

        try {
            $q = $this->passenger->select(['ID', 'Flight', 'Nama', 'Category', 'Seat', 'Birth', 'Phone'])
                    ->where('Flight', $salesRecordMovementId);

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
     * Method getPassenger
     * Get data passenger based on Sales Record Movement Id
     * @param {string} salesRecordMovementId
     * @return {object} result
     *                  result.success {boolean}
     *                  result.data {array}
     *                      data[i].ID {string}
     *                      data[i].Nama {string}
     *                      data[i].Price {int}
     *                      data[i].Stock {int}
     *                      data[i].Flight {string}
     *                      data[i].Sold {int}
     *                      data[i].Total {int}
     *                  result.error {string}
     */
    public function getProduct($salesRecordMovementId) {
        $success = false;
        $error = null;
        $result = null;

        try {
            $q = $this->product->select(['ID', 'Nama', 'Price', 'Stock', 'Flight', 'Sold', 'Total'])
                    ->where('Flight', $salesRecordMovementId);

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
     * Method syncLocal
     * Update status Flight dan keterangan hasil penjualan Product
     * @param {string} salesRecordMovementId
     * @param {object} data
     *                 data.Status {string}
     *                 data.ProductList {array}
     *                      ProductList[i].Stock {int}
     *                      ProductList[i].Sold {int}
     *                      ProductList[i].Total {int}
     *                      ProductList[i].Id {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.sync {object}
     *                      sync.totalSyncFlight {int}
     *                      sync.totalSyncProduct {int}
     */
    public function syncLocal($salesRecordMovementId, $data) {
        $success = false;
        $error = null;
        $totalSyncFlight = $totalSyncProduct = 0;
         
        try {
            $this->connection->beginTransaction();
            
            // update flight
            $query = "UPDATE Flight SET Status = :status WHERE ID = :id;";
            $statement = $this->connection->prepare($query);
            $statement->execute(array(
                ':status' => $data->Status,
                ':id' => $salesRecordMovementId
            ));
            $totalSyncFlight += $statement->rowCount();
                
            // update product
            $query = "UPDATE Product SET Stock = :stock, Sold = :sold, Total = :total WHERE ID = :id;";
            foreach($data->ProductList as $product) {
                $statement = $this->connection->prepare($query);
                $statement->execute(array(
                    ':stock' => $product->Stock,
                    ':sold' => $product->Sold,
                    ':total' => $product->Total,
                    ':id' => $product->Id
                ));
                $totalSyncProduct += $statement->rowCount();
            }

            $this->connection->commit();
            $success = ($totalSyncFlight > 0 && $totalSyncProduct > 0) ? true : false;
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
     * Method insertFlight
     * Insert data Flight
     * @param {array} data
     *                data[i].ID {string}
     *                data[i].No {string}
     *                data[i].Status {string}
     *                data[i].Time {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.total {int}
     */
    public function insertFlight($data) {
        $success = false;
        $error = null;
        $total = 0;
         
        try {
            $this->connection->beginTransaction();
            
            $query = "INSERT INTO Flight (ID, No, Status, Time) VALUES (:ID, :No, :Status, :Time);";
            foreach($data as $item) {
                $statement = $this->connection->prepare($query);
                $statement->execute(array(
                    ':ID' => $item->ID,
                    ':No' => $item->No,
                    ':Status' => $item->Status,
                    ':Time' => $item->Time
                ));
                $total += $statement->rowCount();
            }

            $this->connection->commit();
            $success = $total > 0 ? true : false;
            sleep(0.25);
        } 
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
            $total = 0;
        }

        return (object)array(
            'success' => $success,
            'error' => $error,
            'total' => $total
        );
    }

    /**
     * Method insertPassenger
     * Insert data Passenger
     * @param {array} data
     *                data[i].ID {string}
     *                data[i].Flight {string}
     *                data[i].Nama {string}
     *                data[i].Category {string}
     *                data[i].Seat {string}
     *                data[i].Birth {string}
     *                data[i].Phone {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.total {int}
     */
    public function insertPassenger($data) {
        $success = false;
        $error = null;
        $total = 0;
         
        try {
            $this->connection->beginTransaction();
            
            $query = "INSERT INTO Passenger (ID, Flight, Nama, Category, Seat, Birth, Phone) VALUES (:ID, :Flight, :Nama, :Category, :Seat, :Birth, :Phone);";
            foreach($data as $item) {
                $statement = $this->connection->prepare($query);
                $statement->execute(array(
                    ':ID' => $item->ID,
                    ':Flight' => $item->Flight,
                    ':Nama' => $item->Nama,
                    ':Category' => $item->Category,
                    ':Seat' => $item->Seat,
                    ':Birth' => $item->Birth,
                    ':Phone' => $item->Phone
                ));
                $total += $statement->rowCount();
            }

            $this->connection->commit();
            $success = $total > 0 ? true : false;
            sleep(0.25);
        } 
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
            $total = 0;
        }

        return (object)array(
            'success' => $success,
            'error' => $error,
            'total' => $total
        );
    }

    /**
     * Method insertProduct
     * Insert data Product
     * @param {array} data
     *                data[i].ID {string}
     *                data[i].Nama {string}
     *                data[i].Price {int}
     *                data[i].Stock {int}
     *                data[i].Flight {string}
     *                data[i].Sold {string}
     *                data[i].Total {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.total {int}
     */
    public function insertProduct($data) {
        $success = false;
        $error = null;
        $total = 0;
         
        try {
            $this->connection->beginTransaction();
            
            $query = "INSERT INTO Product (ID, Nama, Price, Stock, Flight, Sold, Total) VALUES (:ID, :Nama, :Price, :Stock, :Flight, :Sold, :Total);";
            foreach($data as $item) {
                $statement = $this->connection->prepare($query);
                $statement->execute(array(
                    ':ID' => $item->ID,
                    ':Nama' => $item->Nama,
                    ':Price' => $item->Price,
                    ':Stock' => $item->Stock,
                    ':Flight' => $item->Flight,
                    ':Sold' => $item->Sold,
                    ':Total' => $item->Total
                ));
                $total += $statement->rowCount();
            }

            $this->connection->commit();
            $success = $total > 0 ? true : false;
            sleep(0.25);
        } 
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
            $total = 0;
        }

        return (object)array(
            'success' => $success,
            'error' => $error,
            'total' => $total
        );
    }

    /**
     * Method insertSyncUser
     * Insert data Sync User
     * @param {array} data
     *                data[i].ID {string}
     *                data[i].Flight {string}
     *                data[i].Status {string}
     *                data[i].User {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.total {int}
     */
    public function insertSyncUser($data) {
        $success = false;
        $error = null;
        $total = 0;
         
        try {
            $this->connection->beginTransaction();
            
            $query = "INSERT INTO Sync_User (ID, Flight, Status, User) VALUES (:ID, :Flight, :Status, :User);";
            foreach($data as $item) {
                $statement = $this->connection->prepare($query);
                $statement->execute(array(
                    ':ID' => $item->ID,
                    ':Flight' => $item->Flight,
                    ':Status' => $item->Status,
                    ':User' => $item->User
                ));
                $total += $statement->rowCount();
            }

            $this->connection->commit();
            $success = $total > 0 ? true : false;
            sleep(0.25);
        } 
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
            $total = 0;
        }

        return (object)array(
            'success' => $success,
            'error' => $error,
            'total' => $total
        );
    }

    /**
     * Method updateSyncUser
     * Update status SyncUser berdasarkan Flight
     * @param {string} salesRecordMovementId
     * @param {object} data
     *                 data.Status {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.sync {object}
     *                      sync.total {int}
     */
    public function updateSyncUser($salesRecordMovementId, $data) {
        $success = false;
        $error = null;
        $total = 0;
         
        try {
            $this->connection->beginTransaction();
            
            $query = "UPDATE Sync_User SET Status = :status WHERE Flight = :id;";
            $statement = $this->connection->prepare($query);
            $statement->execute(array(
                ':status' => $data->Status,
                ':id' => $salesRecordMovementId
            ));
            $total += $statement->rowCount();

            $this->connection->commit();
            $success = $total > 0 ? true : false;
            sleep(0.25);
        } 
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
        }

        return (object)array(
            'success' => $success,
            'error' => $error,
            'total' => $total
        );
    }

    /**
     * Method updateFlight
     * Update status Flight
     * @param {string} salesRecordMovementId
     * @param {object} data
     *                 data.Status {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.sync {object}
     *                      sync.total {int}
     */
    public function updateFlight($salesRecordMovementId, $data) {
        $success = false;
        $error = null;
        $total = 0;
         
        try {
            $this->connection->beginTransaction();
            
            $query = "UPDATE Flight SET Status = :status WHERE ID = :id;";
            $statement = $this->connection->prepare($query);
            $statement->execute(array(
                ':status' => $data->Status,
                ':id' => $salesRecordMovementId
            ));
            $total += $statement->rowCount();

            $this->connection->commit();
            $success = $total > 0 ? true : false;
        } 
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
        }

        return (object)array(
            'success' => $success,
            'error' => $error,
            'sync' => (object)array(
                'total' => $total
            )
        );
    }

    /**
     * Method updateProduct
     * Update keterangan hasil penjualan product
     * @param {string} salesRecordMovementId
     * @param {object} data
     *                 data.ProductList {array}
     *                      ProductList[i].Stock {int}
     *                      ProductList[i].Sold {int}
     *                      ProductList[i].Total {int}
     *                      ProductList[i].Id {string}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.error {string}
     *                  result.sync {object}
     *                      sync.total {int}
     */
    public function updateProduct($data) {
        $success = false;
        $error = null;
        $total = 0;
         
        try {
            $this->connection->beginTransaction();
            
            $query = "UPDATE Product SET Stock = :stock, Sold = :sold, Total = :total WHERE ID = :id;";
            foreach($data->ProductList as $product) {
                $statement = $this->connection->prepare($query);
                $statement->execute(array(
                    ':stock' => $product->Stock,
                    ':sold' => $product->Sold,
                    ':total' => $product->Total,
                    ':id' => $product->Id
                ));
                $total += $statement->rowCount();
            }

            $this->connection->commit();
            $success = $total > 0 ? true : false;
            sleep(0.25);
        } 
        catch (PDOException $e) {
            $this->connection->rollBack();
            $error = $e->getMessage();
            $total = 0;
        }

        return (object)array(
            'success' => $success,
            'error' => $error,
            'sync' => (object)array(
                'total' => $total
            )
        );
    }

    public function __destruct() {
        $this->close();
    }
}