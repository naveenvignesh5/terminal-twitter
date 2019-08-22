<?php
    $token = $_GET['oauth_token'];
    $verifier = $_GET['oauth_verifier'];

    $url = "https://https://api.twitter.com/oauth/access_token?oauth_token=".$token."&oauth_verifier=".$verifier;

    $ch = curl_init();

    curl_setopt($ch,CURLOPT_URL, $url);                
    curl_setopt($ch,CURLOPT_POST, true);

    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);

    if (isset($result)) {
        $result = preg_split ("&", $result);
        $token = (preg_split ("=", $result[0]))[1];
        $secret = (preg_split ("=", $result[1]))[1];
    }
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Twitter Command Tool</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
    <script
        src="https://code.jquery.com/jquery-3.4.1.min.js"
        integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
        crossorigin="anonymous"></script>
    <style>
        .subtitle {
            font-weight: bold;
        }

        #error {
            color: red;
            opacity: 0.8;
        }

    </style>
  </head>
  <body>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Twitter Command Tool - Auth Credentials
      </h1>
      <div class="is-flex">
          <p class="subtitle">oauth_token</p>&nbsp;&nbsp;
          <p>
            <span class="tag is-light" id="oauth_token">
                <?php
                    echo $token;
                ?>
            </span>
        </p>
      </div>
      <div class="is-flex">
          <p class="subtitle">oauth_token_secret</p>&nbsp;&nbsp;
          <p><span class="tag is-light" id="oauth_token_secret"><?php echo $secret; ?></span></p>
      </div>
      <p id="error"></p>
      <p class="subtitle">
        Copy and Paste the above credentials in the command line.<br><br>
        You can close this window after completing signing in.
      </p>
    </div>
  </section>
  </body>
</html>