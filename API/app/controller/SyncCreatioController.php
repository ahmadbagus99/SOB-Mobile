<?php
Defined('BASE_PATH') or die(ACCESS_DENIED);

class SyncCreatio extends Controller
{
    private $data = null;
    private $creatio;

    public function __construct() {
        $this->creatio = new RequestCreatio(BASE_URL_CREATIO, USERNAME_CREATIO, PASSWORD_CREATIO);
        $this->model("SyncModel", "Sync");
    }

    /**
     * 
     */
    public function sync($data) {
        $request = $this->creatio->rest('POST', [
            'service' => 'SyncSOBMobileWS', 
            'method' => 'SyncFlight'
        ], $data);
        
        return $request;
    }
}