<x-mail::message>
  # Dear {{ $userDetails['full_name'] }},

  Thank you for reaching out to Leasy support.<br>
  We have received your message and our team will review it as soon as possible.<br>
  A support representative will get back to you shortly.<br>
  If you need to provide additional details, feel free to reply to this email.<br>

  Best regards,<br>
  The Leasy Support Team

  <x-mail::button :url="'http://localhost:3000'">
    Visit Leasy Now
  </x-mail::button>

  <div style="text-align: center; display: flex;">
    <img src="{{ $message->embed(public_path('/images/LeasyLogo.png')) }}" alt="Leassy-logo" style="height: auto; width: 100px; display: block; margin: 0 auto;">
  </div>

</x-mail::message>