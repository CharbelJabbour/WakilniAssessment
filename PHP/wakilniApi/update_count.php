<?php
error_reporting(E_ALL);
ini_set('display_errors',1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';

$objDb= new DbConnect;
$conn=$objDb->connect();

$isChecked = json_decode(file_get_contents('php://input'), true)['isChecked'];

parse_str(file_get_contents("php://input"), $_PUT);
$id = $_POST ['productId'];
$productName = $_POST["productName"];
$productId=$_GET["productId"];
            
if($isChecked){
    $sqlCount = "UPDATE product_type SET count = count - 1 WHERE id = :productId";
    $stmt = $conn->prepare($sqlCount);
    $stmt->bindParam(':productId', $productId);
    $stmt->bindParam(':product_type_name', $productName);
}

if($stmt->execute()){
    $response=['status' => 1,'message'=> 'Record updated successfully.'];
}else{
    $response=['status' => 0,'message'=> 'Failed to update record'];
}
        
echo json_encode($response);
?>
