<?php
session_start();

// Check if the user is logged in and redirect to login page if not
if(!isset($_SESSION["logged_in"]) || $_SESSION["logged_in"] !== true){
    $_SESSION['error'] = 'You are not logged in.';
    header("location: login.php");
    exit;
}

// Store login data from session
$firstname = $_SESSION["firstname"];
$lastname = $_SESSION["lastname"];
$email = $_SESSION["email"];
?>

<!DOCTYPE HTML>
<html lang="en"> 
	<head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <title>Welcome</title>
	</head>
	<body>
		<div class="container">
			<div class="row bg-primary">
				<div class="col-sm-12 text-center p-3">
					<h3>Welcome</h3>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-2 p-3"></div>

				<div class="col-sm-8 p-3">
					<div style="line-height: 25px; margin-bottom: 10px;">
					<?php
						echo "Name: ".$firstname." ".$lastname."<br>";
						echo "Email: ".$email."<br>";
					?>
					</div>

					<div>
						<form action="logout.php" method="post">
							<input type="hidden" name="action" value="logout"/>
							<button type="submit" class="btn btn-primary">Logout</button>
						</form>
					</div>
                </div>

				<div class="col-sm-2 p-3"></div>
			</div>
		</div>
	</body>
</html>

