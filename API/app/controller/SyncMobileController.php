<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

/**
 * Class Sync Data from Local to Mobile
 */
class SyncMobile extends Controller
{
    private $data = null;

    public function __construct() {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");
        header("Accept: application/json");
        header("Access-Control-Allow-Methods: OPTIONS, GET");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $this->model("SyncModel", "Sync");
    }

    /**
     * Method getSync
     * Sync Flight (Sales Record Movement), Product, dan Passenger
     * Proses Get data Flight, product, dan passenger dari Local ke Mobile
     * @param {string} salesRecordMovementId
     * @return {object} result
     *                  result.success {boolean}
     *                  result.message {string}
     *                  result.data {object}
     *                      data.Flight {object} 
     *                          Flight.ID {string}
     *                          Flight.No {string}
     *                          Flight.Status {string}
     *                          Flight.Time {string}
     *                          Flight.User {string}
     *                      data.Product {array} 
     *                          Product[i].ID {string}
     *                          Product[i].Nama {string}
     *                          Product[i].Price {int}
     *                          Product[i].Stock {int}
     *                          Product[i].Flight {string}
     *                          Product[i].Total {int}
     *                          Product[i].Sold {int}
     *                          Product[i].Passanger {string}
     *                          Product[i].User {string}
     *                      data.Passenger {array}
     *                          Passenger[i].ID {string}
     *                          Passenger[i].Flight {string}
     *                          Passenger[i].Nama {string}
     *                          Passenger[i].Category {string}
     *                          Passenger[i].Seat {string}
     *                          Passenger[i].Birth {string}
     *                          Passenger[i].Phone {string}
     */
    public function getSync($salesRecordMovementId) {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'data' => null
        );

        $flightData = $productData = $passengerData = null;

        $isSalesRecordMovementValid = !empty($salesRecordMovementId);
        if(!$isSalesRecordMovementValid) {
            $this->requestError(200, "Sales Record Movement Id cannot be empty");
        }
        
        try {
            // get data flight
            $getFlight = $this->Sync->getFlight($salesRecordMovementId);
            $flightData = $getFlight->success && count($getFlight->data) > 0 ? $getFlight->data[0] : null;
            if($flightData == null) {
                throw new Exception('Flight not found');
            }

            // get data product
            $getProduct = $this->Sync->getProduct($salesRecordMovementId);
            $productData = $getProduct->success && count($getProduct->data) > 0 ? $getProduct->data : null;
            if($productData == null) {
                throw new Exception('Product not found');
            }

            // get data passanger
            $getPassenger = $this->Sync->getPassenger($salesRecordMovementId);
            $passengerData = $getPassenger->success && count($getPassenger->data) > 0 ? $getPassenger->data : null;
            if($passengerData == null) {
                throw new Exception('Passenger not found');
            }

            // build response
            $result->data = (object)array(
                'Flight' => (object)$flightData,
                'Product' => array_map(function($item) {
                    return (object)$item;
                }, $productData),
                'Passenger' => array_map(function($item) {
                    return (object)$item;
                }, $passengerData)
            );
            $result->success = true;
        } 
        catch (Exception $e) {
            $result->message = 'Something wrong happen: '. $e->getMessage();
        }

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }
    
    /**
     * Method getFlight
     * Sync Flight (Sales Record Movement)
     * Proses get data Flight only
     * @param {string} salesRecordMovementId
     * @return {object} result.success {boolean}
     *                  result.message {string}
     *                  result.data {object}
     *                  
     */
    public function getFlight($salesRecordMovementId) {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'data' => null
        );

        $isSalesRecordMovementValid = !empty($salesRecordMovementId);
        if(!$isSalesRecordMovementValid) {
            $this->requestError(200, "Sales Record Movement Id cannot be empty");
        }
        $getFlight = $this->Sync->getFlight($salesRecordMovementId);
        $result->success = $getFlight->success && count($getFlight->data);
        $result->data = $getFlight->success && count($getFlight->data) > 0 ? $getFlight->data[0] : null;
        $result->message = !$getFlight->success ? 'Something wrong happen: '.$getFlight->error : (count($getFlight->data) > 0 ? '' : 'Data Not Found');

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method getProduct
     */
    public function getProduct($salesRecordMovementId) {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'data' => null
        );

        $isSalesRecordMovementValid = !empty($salesRecordMovementId);
        if(!$isSalesRecordMovementValid) {
            $this->requestError(200, "Sales Record Movement Id cannot be empty");
        }
        $getProduct = $this->Sync->getProduct($salesRecordMovementId);
        $result->data = $getProduct->success && count($getProduct->data) > 0 ? $getProduct->data[0] : null;
        $result->success = $getProduct->success && count($getProduct->data);
        $result->message = !$getProduct->success ? 'Something wrong happen: '.$getProduct->error : (count($getProduct->data) > 0 ? '' : 'Data Not Found');

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }

    /**
     * Method getPassenger
     */
    public function getPassenger($salesRecordMovementId) {
        $result = (object)array(
            'success' => false,
            'message' => '',
            'data' => null
        );

        $isSalesRecordMovementValid = !empty($salesRecordMovementId);
        if(!$isSalesRecordMovementValid) {
            $this->requestError(200, "Sales Record Movement Id cannot be empty");
        }
        $getPassenger = $this->Sync->getPassenger($salesRecordMovementId);
        $result->data = $getPassenger->success && count($getPassenger->data) > 0 ? $getPassenger->data[0] : null;
        $result->success = $getPassenger->success && count($getPassenger->data);;
        $result->message = !$getPassenger->success ? 'Something wrong happen: '.$getPassenger->error : (count($getPassenger->data) > 0 ? '' : 'Data Not Found');

        http_response_code(200);
        echo json_encode($result, JSON_PRETTY_PRINT);
    }
}