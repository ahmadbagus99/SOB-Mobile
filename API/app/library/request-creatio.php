<?php

use \Curl\Curl;

class RequestCreatio {
    private $curl;

    private $url;
    private $username;
    private $password;
    
    private $BPMCSRF = '';
    private $cookies;
    private $body;
    private $success = false;
    private $error = array(
        'code' => '',
        'message' => ''
    );

    public function __construct($url, $username, $password) {
        $this->curl = new Curl();

        $this->url = $url;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Method rest
     * Creatio RESTFull Request
     * @param {array} endpoint
     *              endpoint.service {string}
     *              endpoint.method {string}
     * @param {array} data
     * @return {object} result
     *              result.success {boolean}
     *              result.message {string}
     *              result.response {object}
     */
    public function rest($method, $endpoint, $data = null) {
        $result = (Object)array(
            'success' => false,
            'message' => '',
            'response' => null
        );

        $check = false;
        $i = 0;
        while($i < 3) {
            $request = $this->getRestRequest($method, $endpoint, $data);
            if(!$request->success) {
                $i++;
                $this->getAuth();
            }
            else {
                $check = true;
                $result->success = true;
                $resultName = $endpoint['method']. 'Result';
                $result->response = $request->response->$resultName;
                
                break;
            }
        }
        
        if(!$check) {
            $result->message = $request->message;
        }
        
        return $result;
    }

    /**
     * 
     */
    public function oData($method, $endpoint, $data, $json = true) {
    }

    /**
     * 
     */
    private function getAuth($return = false) {
        $result = (Object)array();

        $url = (substr($this->url, -1) == '/' ? $this->url : $this->url.'/'). 'ServiceModel/AuthService.svc/Login';
        $credential = array(
            'UserName' => $this->username,
            'UserPassword' => $this->password
        );

        $this->curl->setHeaders(array(
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ));
        $this->curl->setCookieJar('cookies.txt');
        $this->curl->post($url, $credential);
        
        if ($this->curl->error) {
            $this->error['code'] = $this->curl->errorCode;
            $this->error['message'] = $this->curl->errorMessage;
        }

        $result->response = $this->body = $this->curl->response;
        $result->cookies = $this->cookies = $this->curl->responseCookies;
        $result->BPMCSRF = $this->BPMCSRF = isset($this->curl->responseCookies['BPMCSRF']) ? $this->curl->responseCookies['BPMCSRF'] : null;
        $result->status_code = $this->curl->getHttpStatusCode();
        $result->error = $this->error;

        $checkError = ((empty($this->error['code']) && empty($this->error['message'])) && !empty($this->curl->response));
        $checkResponseCode = (isset($this->curl->response->Code) && $this->curl->response->Code == 0);
        $checkResponseException = (isset($this->curl->response->Exception) && $this->curl->response->Exception == null);
        if($checkError && ($checkResponseCode || $checkResponseException)) {
            $this->success = true;
        }
        $result->success = $this->success;

        if($return) {
            return $result;
        }
    }

    /**
     * 
     */
    private function getRestRequest($method, $endpoint, $data) {
        $result = (Object)array(
            'success' => false,
            'message' => '',
            'response' => null
        );

        $url = (substr($this->url, -1) == '/' ? $this->url : $this->url.'/'). '0/rest/'.$endpoint['service']. '/' .$endpoint['method'];

        $this->curl->setHeaders(array(
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'BPMCSRF' => $this->BPMCSRF,
            'ForceUseSession' => 'true'
        ));
        $this->curl->setCookieFile('cookies.txt');

        switch (strtolower($method)) {
            case 'post':
                $this->curl->post($url, $data);
                break;

            case 'get':
                $this->curl->get($url, $data);
                break;

            case 'put':
                $this->curl->put($url, $data);
                break;

            case 'delete':
                $this->curl->delete($url, $data);
                break;
            
            default:
                $this->curl->post($url, $data);
                break;
        }

        $result->success = ($this->curl->error) ? false : true;
        $result->message = ($this->curl->error) ? 'Error Code: ' .$this->curl->errorCode. ".\nMessage: " .$this->curl->errorMessage : '';
        $result->response = $this->curl->response;

        return $result;
    }
}