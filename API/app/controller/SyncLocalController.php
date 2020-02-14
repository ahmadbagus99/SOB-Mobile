<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

class SyncLocal extends Controller
{
    private $data = null;

    public function __construct() {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");
        header("Accept: application/json");
        header("Access-Control-Allow-Methods: GET, POST, PUT");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $this->model("SyncLocalModel", "Sync");
    }

    /**
     * Method syncToLocal
     * Proses Sync data yang ada di mobile ke database local
     */
    public function syncToLocal() {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'syncResult' => null
        );

        // get request body
        $this->data = json_decode(file_get_contents("php://input"));
        $isDataValid = isset($this->data) && !empty($this->data);
        $isSRMIdValid = $isDataValid && isset($this->data->SalesMovementRecordId) && !empty($this->data->SalesMovementRecordId);
        $isStatusValid = $isDataValid && isset($this->data->Status) && !empty($this->data->Status);
        $isProductListValid = $isDataValid && isset($this->data->ProductList) && !empty($this->data->ProductList);

        // check SRMId dan Product List tidak boleh kosong
        if(!$isSRMIdValid || !$isProductListValid) {
            $this->requestError(400, "Sales Record Movement Id atau Product List tidak boleh kosong");
        }

        // update data mobile ke local
        $update = $this->Sync->syncLocal($this->data);
        if(!$update->success) {
            $this->requestError(400, "Proses Sync Gagal: ". $update->error);
        }        

        $result->success = true;
        $result->message = 'Proses Sync berhasil';
        $result->syncResult = $update->sync;

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);

        // running background proses sync ke creatio
    }

    /**
     * Method syncToMobile
     * Proses Sync data yang ada di local ke mobile
     */
    public function syncToMobile() {
    }

    /**
     * 
     */
    private function syncFlight() {

    }

    /**
     * 
     */
    private function syncPassenger() {

    }

    /**
     * 
     */
    private function syncProduct() {

    }
}