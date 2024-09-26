<?php
session_start();

$username = $_POST["username"];
$password = $_POST["password"];

$db_servername = "db";
$db_username = "root";
$db_password = "rootpassword";
$db_name = "People";

// Create connection
$conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare the SQL statement
$stmt = $conn->prepare("SELECT `id`, `lastname`, `firstname`, `email`, `password` FROM People.Users
        WHERE email = ? AND password = ?");

// Bind the user and pass strings as parameters
$stmt->bind_param("ss", $username, $password);

// Execute the statement
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Fetch data and direct user to appropriate page
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $_SESSION["logged_in"] = true;
        $_SESSION["lastname"] = $row["lastname"];
        $_SESSION["firstname"] = $row["firstname"];
        $_SESSION["email"] = $row["email"];
    }
    header("Location: welcome.php");
} else {
    $_SESSION['error'] = 'Invalid username or password.';
    header("Location: login.php");
    exit;
}

// Close the statement
$stmt->close();
?>