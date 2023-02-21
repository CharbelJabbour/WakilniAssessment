<?php
error_reporting(E_ALL);
ini_set('display_errors',1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';

$objDb= new DbConnect;
$conn=$objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case "GET":
        $sql = "SELECT * FROM product_type";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($_GET['search'])) {
            $search_query = $_GET['search'];
            $sql .= " WHERE product_type_name LIKE :search_query";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':search_query', '%' . $search_query . '%', PDO::PARAM_STR);
        } elseif(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
        } else {
            $stmt = $conn->prepare($sql);
        }
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as &$product) {
            $product['product_image'] = base64_encode($product['product_image']);
        }
        echo json_encode($products);
        break;

    case "POST":
        $image = $_FILES["productImage"];
        $imageTmp = $image["tmp_name"];
        
        $productName = $_POST["productName"];
        $productDescription = $_POST["productDescription"];
            
        $data = file_get_contents($imageTmp);
            
        $sql="INSERT INTO product_type(product_type_name, product_description, product_image, count) VALUES(:product_type_name, :product_description, :product_image, 0)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':product_type_name', $productName);
        $stmt->bindParam(':product_description', $productDescription);
        $stmt->bindParam(':product_image', $data, PDO::PARAM_LOB);
        $stmt->execute();
            
        echo $conn->lastInsertId();
        break;

        case "PUT":
            parse_str(file_get_contents("php://input"), $_PUT);
            $id = $_POST ['productId'];
            $productName = $_POST["productName"];
                    
            //$data = file_get_contents($imageTmp);
                    
            $sql="UPDATE product_type SET product_type_name =:product_type_name WHERE id =:id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':product_type_name', $productName);
            //$stmt->bindParam(':product_image', $data, PDO::PARAM_LOB);
    
            if($stmt->execute()){
                $response=['status' => 1,'message'=> 'Record updated successfully.'];
            }else{
                $response=['status' => 0,'message'=> 'Failed to update record'];
            }
                    
            echo json_encode($response);
            break;

    // case "PUT":
    //     parse_str(file_get_contents("php://input"), $_PUT);
    //     var_dump($_PUT['productId'] );
    //     $id = $_REQUEST ['productId'];
    //     $productName = $_REQUEST ['product_type_name'];
    //     $productDescription = $_REQUEST ['product_description'];
                
    //     //$data = file_get_contents($imageTmp);
                
    //     $sql="UPDATE product_type SET product_type_name =:product_type_name, product_description =:product_description WHERE id =:id";
    //     $stmt = $conn->prepare($sql);
    //     $stmt->bindParam(':id', $id);
    //     $stmt->bindParam(':product_type_name', $productName);
    //     $stmt->bindParam(':product_description', $productDescription);
    //     //$stmt->bindParam(':product_image', $data, PDO::PARAM_LOB);

    //     if($stmt->execute()){
    //         $response=['status' => 1,'message'=> 'Record updated successfully.'];
    //     }else{
    //         $response=['status' => 0,'message'=> 'Failed to update record'];
    //     }
                
    //     echo json_encode($response);
    //     break;



    case "DELETE":
            $sql = "DELETE FROM product_type WHERE id= :id";
            $path = explode('/', $_SERVER['REQUEST_URI']);
    
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
    
            if($stmt->execute()){
                $response=['status' => 1,'message'=> 'Record deleted successfully.'];
            }else{
                $response=['status' => 0,'message'=> 'Failed to delete record'];
            }
            echo json_encode($response);
            break;

}
