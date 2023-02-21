<?php
error_reporting(E_ALL);
ini_set('display_errors',1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb=new DbConnect;
$conn=$objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch($method){
	case "GET":
		$path = explode('/', $_SERVER['REQUEST_URI']);
		$productId = isset($_GET['productId']) ? $_GET['productId'] : null;
	
		$sql = "SELECT * FROM items";
		if(isset($_GET['search'])) {
            $search_query = $_GET['search'];
            $sql .= " WHERE serialNumber LIKE :search_query";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':search_query', '%' . $search_query . '%', PDO::PARAM_STR);
			$stmt->execute();
			$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($items);
        }else if ($productId) {
			$sql .= " WHERE productId = :productId";
			$stmt = $conn->prepare($sql);
			$stmt->bindParam(':productId', $productId);
			$stmt->execute();
			$items = $stmt->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($items);
		} else {
			$stmt = $conn->prepare($sql);
			$stmt->execute();
			$items = $stmt->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($items);
		}
        break;

    case "POST":
		$item=json_decode(file_get_contents('php://input'));
        $sql="INSERT INTO items(serialNumber, sold, productId) VALUES (:serialNumber, :sold, :productId)";
        $stmt=$conn->prepare($sql);
        $stmt->bindParam(':serialNumber',$item->serialNumber);
		$stmt->bindValue(':sold', false, PDO::PARAM_BOOL);
		$stmt->bindParam(':productId', $item->productId);

		$sqlProduct = "UPDATE product_type SET count = count + 1 WHERE id = :productId";
    	$stmt2 = $conn->prepare($sqlProduct);
    	$stmt2->bindParam(':productId', $item->productId);

    	if ($stmt->execute() && $stmt2->execute()) {
    	    $response = ['status' => 1, 'message' => 'Record created successfully.'];
    	}
        echo json_encode($response);
        break;

	case "PUT":
		$isChecked = json_decode(file_get_contents('php://input'), true)['isChecked'];

		parse_str(file_get_contents("php://input"), $_PUT);
		$itemId=$_GET["itemId"];
		$productId=$_GET["productId"];
            
		if($isChecked){
 		   $sqlCount = "UPDATE product_type SET count = count - 1 WHERE id = :productId";
		    $stmt = $conn->prepare($sqlCount);
		    $stmt->bindParam(':productId', $productId);
		    $stmt->bindParam(':productId', $productId);
			$sqlSold = "UPDATE items SET sold= true WHERE id = :itemId";
			$stmt2 = $conn->prepare($sqlSold);
			$stmt2->bindParam(':itemId', $itemId);

			if($stmt->execute() && $stmt2->execute()){
				  $response=['status' => 1,'message'=> 'Record updated successfully.'];
			}else{
				$response=['status' => 0,'message'=> 'Failed to update record'];
			}
			echo json_encode($response);
		}
        
		break;	

	case "DELETE":
		$path = explode('/', $_SERVER['REQUEST_URI']);
		$id = intval($path[4]);
		$productId=$_GET["productId"];

		$sql = "DELETE FROM items WHERE id = :id";
		$stmt = $conn->prepare($sql);
		$stmt->bindParam(':id', $id);
		

		$sqlCount = "UPDATE product_type pt SET pt.count = pt.count - 1 WHERE pt.id = :productId
					AND EXISTS (SELECT 1 FROM items i WHERE i.id = :itemId AND i.sold = 0)";
		$stmt2 = $conn->prepare($sqlCount);
		$stmt2->bindParam(':productId', $productId);
		$stmt2->bindParam(':itemId', $id);
		$stmt2->execute();

		if($stmt->execute()){
			$response=['status' => 1,'message'=> 'Record deleted successfully.'];
		}else{
			$response=['status' => 0,'message'=> 'Failed to delete record'];
		}
		echo json_encode($response);
		break;
	}

?>
