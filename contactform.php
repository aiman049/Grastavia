<?php
// api/contact.php - Process Contact Form

require_once '../config/database.php';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Get form data
    $full_name = mysqli_real_escape_string($conn, $_POST['full_name'] ?? '');
    $email = mysqli_real_escape_string($conn, $_POST['email'] ?? '');
    $phone = mysqli_real_escape_string($conn, $_POST['phone'] ?? '');
    $message = mysqli_real_escape_string($conn, $_POST['message'] ?? '');
    
    // Validate inputs
    $errors = [];
    
    if (empty($full_name)) {
        $errors[] = "Full name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // If no errors, save to database
    if (empty($errors)) {
        
        $sql = "INSERT INTO contact_messages (full_name, email, phone, message, created_at, status) 
                VALUES ('$full_name', '$email', '$phone', '$message', NOW(), 'unread')";
        
        if (mysqli_query($conn, $sql)) {
            // Success response
            $response = [
                'success' => true,
                'message' => 'Thank you for contacting us! We will get back to you soon.',
                'data' => [
                    'name' => $full_name,
                    'email' => $email
                ]
            ];
            
            // Optional: Send email notification
            $to = "info@gastrevia.pk";
            $subject = "New Contact Message from $full_name";
            $email_message = "Name: $full_name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";
            $headers = "From: $email";
            
            // Uncomment to enable email sending
            // mail($to, $subject, $email_message, $headers);
            
            echo json_encode($response);
        } else {
            // Database error
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error: ' . mysqli_error($conn)
            ]);
        }
        
    } else {
        // Validation errors
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors
        ]);
    }
    
} else {
    // Not POST request
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}

mysqli_close($conn);
?>