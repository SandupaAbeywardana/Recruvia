<?php

namespace App\Notifications;

use App\Models\Application;
use App\Models\JobPost;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewJobApplication extends Notification
{
    use Queueable;

    public bool $isCandidate;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Application $application,
        public JobPost $job,
        bool $isCandidate = false
    ) {
        $this->isCandidate = $isCandidate;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mail = new MailMessage;

        if ($this->isCandidate) {
            return $mail
                ->subject('Your application was received')
                ->greeting("Hi {$this->application->first_name},")
                ->line("You have successfully applied for the job: **{$this->job->title}**.")
                ->line('Thank you for applying. We will notify you if you are shortlisted.')
                ->action('View Job', url('/jobs/' . $this->job->id))
                ->attach(storage_path('app/public/' . $this->application->resume_path), [
                    'as' => 'Resume.pdf',
                    'mime' => 'application/pdf'
                ]);
        }

        return $mail
            ->subject('New Job Application Received')
            ->greeting("Hello {$this->job->employer->name},")
            ->line("A new candidate has applied for your job post: **{$this->job->title}**.")
            ->line("Candidate: **{$this->application->first_name} {$this->application->last_name}**")
            ->line("Email: {$this->application->email}")
            ->line("Phone: {$this->application->phone}")
            ->action('View Applications', url('/employer/jobs/' . $this->job->id . '/applications'))
            ->attach(storage_path('app/public/' . $this->application->resume_path), [
                'as' => 'Resume.pdf',
                'mime' => 'application/pdf'
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
