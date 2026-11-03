<?php
/* FineBites inquiry mailer (Hostinger PHP).
   Receives the website forms (js/inquiry.js) and emails them to $TO.
   The customer's address is set as Reply-To, so "Reply" in the inbox answers them directly. */

$TO   = 'info@finebitesllc.com';
$FROM = 'no-reply@finebitesllc.com'; // must be on the site's own domain or Hostinger may drop the mail

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

function out($ok, $code = 200, $msg = '') {
  http_response_code($code);
  echo json_encode(['ok' => $ok, 'error' => $msg]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 405, 'method');

/* only accept posts from this site */
if (!empty($_SERVER['HTTP_ORIGIN'])) {
  $originHost = parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
  $siteHost   = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
  if (strcasecmp(preg_replace('/^www\./i', '', (string)$originHost), preg_replace('/^www\./i', '', $siteHost)) !== 0) out(false, 403, 'origin');
}

/* honeypot: real visitors never fill this hidden field */
if (!empty($_POST['website'])) out(true);

/* simple rate limit: 5 inquiries per IP per 10 minutes */
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'x';
$file = sys_get_temp_dir() . '/fb_inq_' . md5($ip);
$now  = time();
$hits = [];
if (is_file($file)) $hits = array_filter(array_map('intval', explode(',', (string)@file_get_contents($file))), function ($t) use ($now) { return $t > $now - 600; });
if (count($hits) >= 5) out(false, 429, 'rate');
$hits[] = $now;
@file_put_contents($file, implode(',', $hits));

function field($k, $max = 200, $multiline = false) {
  $v = isset($_POST[$k]) ? trim((string)$_POST[$k]) : '';
  $v = str_replace("\0", '', $v);
  $v = $multiline ? str_replace("\r", '', $v) : preg_replace('/[\r\n\t]+/', ' ', $v);
  return substr($v, 0, $max);
}

$name     = field('fullName', 120);
$company  = field('companyName', 160);
$email    = field('email', 160);
$phone    = field('phone', 60);
$country  = field('country', 60);
$quantity = field('quantity', 160);
$product  = field('product', 200);
if ($product === '') $product = field('productInterest', 200);
$notes    = field('notes', 3000, true);
$message  = field('message', 3000, true);
$formName = field('form', 60);
$page     = field('page', 300);

if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) out(false, 422, 'fields');

$lines = [
  'Name'      => $name,
  'Company'   => $company,
  'Email'     => $email,
  'Phone'     => $phone,
  'Country'   => $country,
  'Quantity'  => $quantity,
  'Product'   => $product,
];
$body = "New inquiry from the FineBites website\n\n";
foreach ($lines as $label => $v) if ($v !== '') $body .= str_pad($label . ':', 11) . $v . "\n";
if ($message !== '') $body .= "\nMessage:\n" . $message . "\n";
if ($notes !== '')   $body .= "\nNotes:\n" . $notes . "\n";
$body .= "\n--\nForm: " . ($formName ?: 'website') . "\nPage: " . $page . "\nSent: " . gmdate('Y-m-d H:i') . " UTC\nIP: " . $ip . "\n";

$subjectText = 'Website inquiry: ' . $name . ($company !== '' ? ' (' . $company . ')' : '');
$subject     = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';
$replyName   = preg_replace('/["<>\\\\]/', '', $name);

$headers  = 'From: FineBites Website <' . $FROM . ">\r\n";
$headers .= 'Reply-To: "' . $replyName . '" <' . $email . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

if (!@mail($TO, $subject, $body, $headers)) out(false, 500, 'mail');
out(true);
