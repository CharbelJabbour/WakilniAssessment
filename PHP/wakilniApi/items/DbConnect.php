<?php

class DbConnect {
    private $server='localhost';
    private $dbname='productshop';
    private $user='root';
    private $pass='';

    public function connect(){
        try{
            $con=new PDO('mysql:host=' .$this->server . ';dbname=' .$this->dbname,$this->user,$this->pass);
            $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $con;
        }catch(\Exception $e){
            echo "Database Error: " .$e->getMessage();
        }
    }
}