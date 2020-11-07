<?php
function sendEmail($to, $subject, $message)
{
    global $send_email_e;
    $from = "info@ecoprognoz.org";
    $headers = "From: $from\r\nReply-to: $from\r\nContent-type: text/html; charset=utf-8\r\n";
    if(!mail($to, $subject, $message, $headers)) {
        $send_email_e[] = "Ошибка отправки сообщения";
        return false;
    }
    return true;
}
