<x-mail::message>
  # Dear Support Team,

  A new support request has been generated from the Leasy.<br>
  Below are the details:

  **Submitted By:** {{ $userDetails['full_name'] }} <br>
  **Email:** {{ $userDetails['email'] }}<br>
  **Date:** {{ \Carbon\Carbon::now()->format('Y-m-d') }}

  **Subject:** {{ $mailSubject }}<br>
  **Message:**<br>
  {{ $mailContent }}

  <hr>

  Please review this request and take the necessary actions.

  Thank you,
  Support System

  <div style="text-align: center; display: flex;">
    <img src="{{ $message->embed(public_path('/images/LeasyLogo.png')) }}" alt="Leassy-logo" style="height: auto; width: 100px; display: block; margin: 0 auto;">
  </div>
</x-mail::message>