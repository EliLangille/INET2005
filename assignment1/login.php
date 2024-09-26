<?php
// Start the session
session_start();
?>

<!DOCTYPE HTML>
<html lang="en"> 
	<head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <title>Login</title>
	</head>
	<body>
		<div class="container">
			<div class="row bg-primary">
				<div class="col-sm-12 text-center p-3">
					<h3>Login</h3>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-2 p-3"></div>

				<div class="col-sm-8 p-3">
                    <?php
                    // If an error message is set, display it
                    if (isset($_SESSION['error'])) {
                        echo '<div class="alert alert-danger">' . $_SESSION['error'] . '</div>';

                        // Unset the error message
                        unset($_SESSION['error']);
                    }
                    ?>

                    <form action="authenticate.php" method="post">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="username" class="form-control" name="username" id="username" placeholder="Enter Username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" name="password" placeholder="Enter Password" required>
                        </div>					  
                        <input type="hidden" name="action" value="authenticate"/>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>

				<div class="col-sm-2 p-3"></div>
			</div>
		</div>
	</body>
</html>

