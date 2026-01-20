<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobApplied extends Notification
{
    use Queueable;

    public $application;
    public $job;
    public $candidate;

    public function __construct($application, $job, $candidate)
    {
        $this->application = $application;
        $this->job = $job;
        $this->candidate = $candidate;
    }

    public function via(object $notifiable): array
    {
        return ['database']; // Add 'mail' if mailer is configured
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('A new candidate has applied for your job: ' . $this->job->title)
                    ->action('View Application', url('/jobs/' . $this->job->id . '/applications'))
                    ->line('Thank you for using our platform!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'New application for ' . $this->job->title,
            'job_id' => $this->job->id,
            'candidate_id' => $this->candidate->id,
            'candidate_name' => $this->candidate->name,
            'application_id' => $this->application->id,
        ];
    }
}
