<?php
// api/booking.php - Process Tour Bookings

require_once '../config/database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get available packages
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['packages'])) {
    $sql = "SELECT package_id, package_name, description, price, duration_days FROM packages";
    $result = mysqli_query($conn, $sql);
    
    $packages = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $packages[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'packages' => $packages
    ]);
    exit();
}

// Process booking
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Check if JSON or form data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input) {
        $full_name = mysqli_real_escape_string($conn, $input['full_name'] ?? '');
        $email = mysqli_real_escape_string($conn, $input['email'] ?? '');
        $phone = mysqli_real_escape_string($conn, $input['phone'] ?? '');
        $package_id = intval($input['package_id'] ?? 0);
    } else {
        $full_name = mysqli_real_escape_string($conn, $_POST['full_name'] ?? '');
        $email = mysqli_real_escape_string($conn, $_POST['email'] ?? '');
        $phone = mysqli_real_escape_string($conn, $_POST['phone'] ?? '');
        $package_id = intval($_POST['package_id'] ?? 0);
    }
    
    // Validate
    $errors = [];
    
    if (empty($full_name)) $errors[] = "Full name is required";
    if (empty($email)) $errors[] = "Email is required";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email";
    if ($package_id <= 0) $errors[] = "Please select a package";
    
    if (empty($errors)) {
        
        // Start transaction
        mysqli_begin_transaction($conn);
        
        try {
            // Insert customer
            $customer_sql = "INSERT INTO customers (full_name, email, phone, created_at) 
                             VALUES ('$full_name', '$email', '$phone', NOW())";
            
            if (!mysqli_query($conn, $customer_sql)) {
                throw new Exception("Customer insert failed: " . mysqli_error($conn));
            }
            
            $customer_id = mysqli_insert_id($conn);
            
            // Insert booking
            $booking_sql = "INSERT INTO bookings (customer_id, package_id, booking_date, status, created_at) 
                            VALUES ('$customer_id', '$package_id', CURDATE(), 'pending', NOW())";
            
            if (!mysqli_query($conn, $booking_sql)) {
                throw new Exception("Booking insert failed: " . mysqli_error($conn));
            }
            
            $booking_id = mysqli_insert_id($conn);
            
            // Get package details
            $package_sql = "SELECT package_name, price FROM packages WHERE package_id = $package_id";
            $package_result = mysqli_query($conn, $package_sql);
            $package = mysqli_fetch_assoc($package_result);
            
            // Commit transaction
            mysqli_commit($conn);
            
            // Success response
            echo json_encode([
                'success' => true,
                'message' => 'Booking Successful!',
                'booking_id' => $booking_id,
                'customer_name' => $full_name,
                'package_name' => $package['package_name'],
                'price' => $package['price']
            ]);
            
        } catch (Exception $e) {
            mysqli_rollback($conn);
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Booking failed: ' . $e->getMessage()
            ]);
        }
        
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors
        ]);
    }
}

mysqli_close($conn);
?>