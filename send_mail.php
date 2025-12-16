<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

// Basic input retrieval and sanitization
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$name || !$email || !$message) {
  http_response_code(400);
  echo json_encode(['error' => 'Name, email and message are required.']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid email address.']);
  exit;
}

$to = 'ridebuddytours@gmail.com';
$subject = "New contact from Ride Buddy Tours: " . substr($name,0,100);

// Build message body
$body = "You have a new contact form submission:\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Phone: " . $phone . "\n\n";
$body .= "Message:\n" . $message . "\n";

// Headers
$from_domain = $_SERVER['SERVER_NAME'] ?? 'localhost';
$headers = "From: Ride Buddy Website <no-reply@" . $from_domain . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

// Attempt to send
$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
  echo json_encode(['success' => true, 'message' => 'Message sent']);
  exit;
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Mail failed to send. Ensure the server supports PHP mail or configure SMTP.']);
  exit;
}
