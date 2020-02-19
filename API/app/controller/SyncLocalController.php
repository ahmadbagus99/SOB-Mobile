<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

/**
 * Class Sync Data from Mobile to Local
 */
class SyncLocal extends Controller
{
    private $data = null;
    private $syncCreatio;

    public function __construct() {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        header("Accept: application/json");
        header("Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $this->model("SyncModel", "Sync");
        $this->model("UserModel", "User");
        
        require_once CONTROLLER. 'SyncCreatioController.php';
        $this->syncCreatio = new SyncCreatio();
    }

    /**
     * Method updateSync
     * Sync Flight (Sales Record Movement) dan Product
     * Proses Sync data yang ada di mobile ke database local
     * @param {string} salesRecordMovementId
     * @param {object} data
     *              data.Status {string}
     *              data.ProductList {array of object}
     *                  ProductList[i].Id {string}
     *                  ProductList[i].Stock {int}
     *                  ProductList[i].Sold {int}
     *                  ProductList[i].Total {int}
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.syncResult {object}
     *                      syncResult.totalSyncFlight {int}
     *                      syncResult.totalSyncProduct {int}
     */
    public function updateSync($salesRecordMovementId) {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'syncResult' => null
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isSalesRecordMovementValid = !empty($salesRecordMovementId);
        $isDataValid = isset($this->data) && !empty($this->data);
        $isStatusValid = $isDataValid && isset($this->data->Status) && !empty($this->data->Status);
        $isProductListValid = $isDataValid && isset($this->data->ProductList) && !empty($this->data->ProductList);

        // check SRMId, status dan Product List tidak boleh kosong
        if(!$isSalesRecordMovementValid || !$isStatusValid || !$isProductListValid) {
            $this->requestError(200, "Sales Record Movement Id, Status and Product List cannot be empty");
        }
        
        // update data mobile ke local
        $update = $this->Sync->syncLocal($salesRecordMovementId, $this->data);
        if(!$update->success) {
            $this->requestError(200, "Sync Process is Fail: ". $update->error);
        }        

        $result->success = true;
        $result->message = 'Sync Process is Success';
        $result->syncResult = $update->sync;

        // running background proses sync ke creatio
        // $this->syncCreatio->sync(json_encode(array(
        //     'SalesRecordMovementId' => $salesRecordMovementId,
        //     'Status' => $this->data->Status,
        //     'ProductList' => $this->data->ProductList
        // )));
        
        $creatioData = json_encode(array(
            'SalesRecordMovementId' => $salesRecordMovementId,
            'Status' => $this->data->Status,
            'ProductList' => $this->data->ProductList
        ));
        $syncCreatio = $this->syncCreatio->sync($creatioData);
        
        if($syncCreatio->Success) {
            $this->User->updateSyncUser($salesRecordMovementId);
        }
        
        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method updateFlight
     * Sync Flight only
     * Proses Sync data yang ada di mobile ke database local
     * @param {string} salesRecordMovementId
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.syncResult {object}
     *                      syncResult.total {int}
     */
    public function updateFlight($salesRecordMovementId) {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'syncResult' => null
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isSalesRecordMovementValid = !empty($salesRecordMovementId);
        $isDataValid = isset($this->data) && !empty($this->data);
        $isStatusValid = $isDataValid && isset($this->data->Status) && !empty($this->data->Status);

        if(!$isSalesRecordMovementValid || !$isStatusValid) {
            $this->requestError(200, "Sales Record Movement Id, dan Status tidak boleh kosong");
        }
        
        // update data mobile ke local
        $update = $this->Sync->updateFlight($salesRecordMovementId, $this->data);
        if(!$update->success) {
            $this->requestError(200, "Proses Sync Flight Gagal: ". $update->error);
        }        

        $result->success = true;
        $result->message = 'Proses Sync Flight berhasil';
        $result->syncResult = $update->sync;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method updateProduct
     * Sync Product only
     * Proses Sync data yang ada di mobile ke database local
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.syncResult {object}
     *                      syncResult.total {int}
     */
    public function updateProduct() {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'syncResult' => null
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isProductListValid = $isDataValid && isset($this->data->ProductList) && !empty($this->data->ProductList);

        // check SRMId dan Product List tidak boleh kosong
        if(!$isProductListValid) {
            $this->requestError(200, "Product List tidak boleh kosong");
        }
        
        // update data mobile ke local
        $update = $this->Sync->updateProduct($this->data);
        if(!$update->success) {
            $this->requestError(200, "Proses Sync Product Gagal: ". $update->error);
        }        

        $result->success = true;
        $result->message = 'Proses Sync Product berhasil';
        $result->syncResult = $update->sync;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * 
     */
    public function updateSyncProduct() {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'syncResult' => null
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isProductListValid = $isDataValid && isset($this->data->ProductList) && !empty($this->data->ProductList);

        // check SRMId dan Product List tidak boleh kosong
        if(!$isProductListValid) {
            $this->requestError(200, "Product List cannot be empty");
        }
        
        // update data mobile ke local
        $update = $this->Sync->updateSyncProduct($this->data);
        if(!$update->success) {
            $this->requestError(200, "Sync Product Process is Fail: ". $update->error);
        }        

        $result->success = true;
        $result->message = 'Sync Product Process is Success';
        $result->syncResult = $update->sync;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method updateSyncUser
     * Sync SyncUser only
     * Proses update status SyncUser berdasarkan SalesRecrdMovementId
     * @param {string} salesRecordMovementId
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.total {int}
     */
    public function updateSyncUser($salesRecordMovementId) {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'total' => 0
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isStatusValid = $isDataValid && isset($this->data->Status) && !empty($this->data->Status);
        $isSalesRecordMovementValid = !empty($salesRecordMovementId);

        if(!$isSalesRecordMovementValid || !$isStatusValid) {
            $this->requestError(200, "Sales Record Movement Id, and Status cannot be empty");
        }
        
        // update data mobile ke local
        $update = $this->Sync->updateSyncUser($salesRecordMovementId, $this->data);
        if(!$update->success) {
            $this->requestError(200, "Sync SyncUser Procecss is fail: ". $update->error);
        }        

        $result->success = true;
        $result->message = 'Sync SyncUser Process is success';
        $result->total = $update->total;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method addFlight
     * Proses menambah flight dari creatio ke local
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.total {int}
     */
    public function addFlight() {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'total' => 0
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isFlightListValid = $isDataValid && isset($this->data->data) && !empty($this->data->data);

        if(!$isFlightListValid) {
            $this->requestError(200, "Flight List is empty");
        }
        
        // insert data ke local
        $insert = $this->Sync->insertFlight($this->data->data);
        if(!$insert->success) {
            $this->requestError(200, "Something Error: ". $insert->error);
        }        

        $result->success = true;
        $result->message = 'Add Flight Success';
        $result->total = $insert->total;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method addProduct
     * Proses menambah product dari creatio ke local
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.total {int}
     */
    public function addProduct() {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'total' => 0
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isProductListValid = $isDataValid && isset($this->data->data) && !empty($this->data->data);

        if(!$isProductListValid) {
            $this->requestError(200, "Product List is empty");
        }
        
        // insert data ke local
        $insert = $this->Sync->insertProduct($this->data->data);
        if(!$insert->success) {
            $this->requestError(200, "Something Error: ". $insert->error);
        }        

        $result->success = true;
        $result->message = 'Add Product Success';
        $result->total = $insert->total;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method addPassenger
     * Proses menambah passenger dari creatio ke local
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.total {int}
     */
    public function addPassenger() {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'total' => 0
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isPassengerListValid = $isDataValid && isset($this->data->data) && !empty($this->data->data);

        if(!$isPassengerListValid) {
            $this->requestError(200, "Passenger List is empty");
        }
        
        // insert data ke local
        $insert = $this->Sync->insertPassenger($this->data->data);
        if(!$insert->success) {
            $this->requestError(200, "Something Error: ". $insert->error);
        }        

        $result->success = true;
        $result->message = 'Add Passenger Success';
        $result->total = $insert->total;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method addSyncUser
     * Proses menambah SyncUser (Crew) dari creatio ke local
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.total {int}
     */
    public function addSyncUser() {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'total' => 0
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isSyncUserListValid = $isDataValid && isset($this->data->data) && !empty($this->data->data);

        if(!$isSyncUserListValid) {
            $this->requestError(200, "SyncUser List is empty");
        }
        
        // insert data ke local
        $insert = $this->Sync->insertSyncUser($this->data->data);
        if(!$insert->success) {
            $this->requestError(200, "Something Error: ". $insert->error);
        }        

        $result->success = true;
        $result->message = 'Add SyncUser Success';
        $result->total = $insert->total;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }
}