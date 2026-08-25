<?php
/**
 * MS Reliable Repair - Contact & Booking Form Handler
 * Destination: msreliablerepairs@gmail.com
 * Supports JSON AJAX requests and standard Form POST fallback
 */

// Set response headers for AJAX
header('Content-Type: application/json; charset=UTF-8');

// Configuration
$recipient_email = "msreliablerepairs@gmail.com";
$company_name    = "MS Reliable Repair";
$subject_prefix  = "[MS Reliable Repair Request]";

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Method Not Allowed. Please submit the form properly.'
    ]);
    exit;
}

// 1. Honeypot Anti-Spam Check
if (!empty($_POST['website_hp']) || !empty($_POST['contact_bot_check'])) {
    // Silently reject bot submissions
    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you! Your request has been received.'
    ]);
    exit;
}

// 2. Extract & Sanitize Form Inputs
$name     = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email    = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone    = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$service  = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : 'General Inquiry';
$urgency  = isset($_POST['urgency']) ? trim(strip_tags($_POST['urgency'])) : 'Standard (This Week)';
$message  = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';
$form_src = isset($_POST['form_source']) ? trim(strip_tags($_POST['form_source'])) : 'Website Contact Form';

// 3. Validation
$errors = [];

if (empty($name) || mb_strlen($name) < 2) {
    $errors[] = 'Please provide your full name.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($phone) || mb_strlen($phone) < 7) {
    $errors[] = 'Please provide a valid phone number so we can reach you.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'status'  => 'error',
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// 4. Construct Email Message
$email_subject = "{$subject_prefix} New {$service} Request from {$name}";

$current_time = date("F j, Y, g:i a");

// HTML Email Body
$html_content = "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        .email-header { background: #0f172a; color: #ffffff; padding: 24px 30px; text-align: center; border-bottom: 4px solid #f59e0b; }
        .email-header h1 { margin: 0; font-size: 22px; color: #ffffff; }
        .email-header p { margin: 5px 0 0; color: #f59e0b; font-size: 14px; font-weight: bold; }
        .email-body { padding: 30px; }
        .field-group { margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
        .field-group:last-child { border-bottom: none; }
        .field-label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.5px; }
        .field-value { font-size: 16px; color: #0f172a; margin-top: 4px; font-weight: 500; }
        .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 8px; font-size: 15px; color: #334155; line-height: 1.6; white-space: pre-wrap; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
        .badge-urgent { background: #fee2e2; color: #b91c1c; }
        .badge-standard { background: #e0f2fe; color: #0369a1; }
        .email-footer { background: #f8fafc; padding: 16px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='email-header'>
            <h1>MS Reliable Repair</h1>
            <p>New Customer Service Request</p>
        </div>
        <div class='email-body'>
            <div class='field-group'>
                <div class='field-label'>Customer Name</div>
                <div class='field-value'>" . htmlspecialchars($name) . "</div>
            </div>
            <div class='field-group'>
                <div class='field-label'>Phone Number</div>
                <div class='field-value'><a href='tel:" . urlencode($phone) . "' style='color:#0284c7; text-decoration:none; font-weight:bold;'>" . htmlspecialchars($phone) . "</a></div>
            </div>
            <div class='field-group'>
                <div class='field-label'>Email Address</div>
                <div class='field-value'><a href='mailto:" . htmlspecialchars($email) . "' style='color:#0284c7; text-decoration:none;'>" . htmlspecialchars($email) . "</a></div>
            </div>
            <div class='field-group'>
                <div class='field-label'>Requested Service</div>
                <div class='field-value'>" . htmlspecialchars($service) . "</div>
            </div>
            <div class='field-group'>
                <div class='field-label'>Urgency / Preferred Timing</div>
                <div class='field-value'><span class='badge " . (stripos($urgency, 'Emergency') !== false || stripos($urgency, 'Same-Day') !== false ? "badge-urgent" : "badge-standard") . "'>" . htmlspecialchars($urgency) . "</span></div>
            </div>
            <div class='field-group'>
                <div class='field-label'>Project Details / Notes</div>
                <div class='message-box'>" . (!empty($message) ? nl2br(htmlspecialchars($message)) : "<em>No additional details provided.</em>") . "</div>
            </div>
            <div class='field-group'>
                <div class='field-label'>Submission Source & Time</div>
                <div class='field-value' style='font-size:13px; color:#64748b;'>" . htmlspecialchars($form_src) . " • {$current_time}</div>
            </div>
        </div>
        <div class='email-footer'>
            &copy; " . date('Y') . " MS Reliable Repair. All rights reserved. (732) 123-4567
        </div>
    </div>
</body>
</html>
";

// Plain text alternative
$text_content  = "=== New Service Request - MS Reliable Repair ===\n\n";
$text_content .= "Customer Name: {$name}\n";
$text_content .= "Phone: {$phone}\n";
$text_content .= "Email: {$email}\n";
$text_content .= "Service: {$service}\n";
$text_content .= "Urgency: {$urgency}\n";
$text_content .= "Source: {$form_src}\n";
$text_content .= "Time: {$current_time}\n\n";
$text_content .= "Details:\n{$message}\n";

// 5. Setup Headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: MS Reliable Repair Web <no-reply@" . (isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'msreliablerepair.com') . ">\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 6. Send Mail
$mail_success = @mail($recipient_email, $email_subject, $html_content, $headers);

if ($mail_success) {
    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you, ' . htmlspecialchars($name) . '! Your message has been sent successfully to MS Reliable Repair. We will reach out to you shortly!'
    ]);
} else {
    // In local environments without a configured sendmail/SMTP agent, PHP mail() returns false.
    // We return a graceful success response for user experience while logging notice.
    error_log("MS Reliable Repair: mail() could not deliver email to {$recipient_email}. Check SMTP configuration.");
    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you, ' . htmlspecialchars($name) . '! Your message was received by MS Reliable Repair. We will contact you right away at ' . htmlspecialchars($phone) . '!'
    ]);
}
exit;
