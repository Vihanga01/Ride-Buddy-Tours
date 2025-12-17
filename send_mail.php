<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

// Determine request type - either booking or contact form
$isBooking = isset($_POST['tour_id']) && isset($_POST['customer_name']);

if ($isBooking) {
  // BOOKING FORM PROCESSING
  $tourId = trim($_POST['tour_id'] ?? '');
  $tourName = trim($_POST['tour_name'] ?? '');
  $tourPrice = trim($_POST['tour_price'] ?? '');
  $customerName = trim($_POST['customer_name'] ?? '');
  $customerEmail = trim($_POST['customer_email'] ?? '');
  $customerPhone = trim($_POST['customer_phone'] ?? '');
  $participants = trim($_POST['participants'] ?? '');
  $preferredDate = trim($_POST['preferred_date'] ?? '');
  $specialRequests = trim($_POST['special_requests'] ?? '');

  // Validation
  if (!$customerName || !$customerEmail || !$customerPhone || !$participants || !$preferredDate) {
    http_response_code(400);
    echo json_encode(['error' => 'Please fill in all required fields.']);
    exit;
  }

  if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address.']);
    exit;
  }

  $to = 'ridebuddytours@gmail.com';
  $subject = "New Booking Inquiry: " . substr($tourName, 0, 50);

  // Build message body
  $body = "=== NEW BOOKING INQUIRY ===\n\n";
  $body .= "TOUR DETAILS:\n";
  $body .= "Tour: " . $tourName . "\n";
  $body .= "Price: $" . $tourPrice . "\n";
  $body .= "Tour ID: " . $tourId . "\n\n";
  
  $body .= "CUSTOMER INFORMATION:\n";
  $body .= "Name: " . $customerName . "\n";
  $body .= "Email: " . $customerEmail . "\n";
  $body .= "Phone: " . $customerPhone . "\n\n";

  $body .= "BOOKING REQUEST:\n";
  $body .= "Number of Participants: " . $participants . "\n";
  $body .= "Preferred Start Date: " . $preferredDate . "\n";
  if ($specialRequests) {
    $body .= "\nSpecial Requests/Notes:\n" . $specialRequests . "\n";
  }

  $body .= "\n" . "--- End of Booking Inquiry ---";

} else {
  // CONTACT FORM PROCESSING (original functionality)
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
  $subject = "New contact from Ride Buddy Tours: " . substr($name, 0, 100);

  // Build message body
  $body = "You have a new contact form submission:\n\n";
  $body .= "Name: " . $name . "\n";
  $body .= "Email: " . $email . "\n";
  $body .= "Phone: " . $phone . "\n\n";
  $body .= "Message:\n" . $message . "\n";
}

// Headers
$from_domain = $_SERVER['SERVER_NAME'] ?? 'localhost';
$headers = "From: Ride Buddy Website <no-reply@" . $from_domain . ">\r\n";
$headers .= "Reply-To: " . ($isBooking ? $customerEmail : $email) . "\r\n";
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
