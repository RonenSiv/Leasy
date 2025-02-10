<x-mail::message>
  # Welcome to Leasy, {{ $userDetails['full_name'] }}! 🎉

  We are excited to have you on board. Your registration was successful, and you can now start using our services.

  To get started, click the button below:

  <x-mail::button :url="'http://localhost:3000'">
    Login to Your Account
  </x-mail::button>

  If you have any questions, feel free to contact our support team.

  Thanks,
  *Leasy - Lectures Made Easy*
</x-mail::message>