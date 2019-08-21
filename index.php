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
          <p><span class="tag is-light" id="oauth_token">NULL</span></p>
      </div>
      <div class="is-flex">
          <p class="subtitle">oauth_token_secret</p>&nbsp;&nbsp;
          <p><span class="tag is-light" id="oauth_token_secret">NULL</span></p>
      </div>
      <p id="error"></p>
      <p class="subtitle">
        Copy and Paste the above credentials in the command line.<br><br>
        You can close this window after completing signing in.
      </p>
    </div>
  </section>
  <script>
        (function() {
            let url = new URL(window.location.href);
            let oauth_token = url.searchParams.get("oauth_token");
            let oauth_verifier = url.searchParams.get("oauth_verifier");
    
            if (!oauth_token || !oauth_verifier) {
                $('#error').text('Unable to get credentials. Something went wrong !!!');
                return;
            }

            $.post(`https://api.twitter.com/oauth/access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`, function(data) {
                let user_access_token = data.split('&')[0].split('=')[1];
                let user_access_token_secret = data.split('&')[1].split('=')[1]; 
            });
    
            $('#oauth_token').text(user_access_token);
            $('#oauth_token_secret').text(user_access_token_secret);
        })();
  </script>
  </body>
</html>