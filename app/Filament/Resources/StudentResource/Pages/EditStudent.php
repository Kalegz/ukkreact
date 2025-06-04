<?php

namespace App\Filament\Resources\StudentResource\Pages;

use App\Filament\Resources\StudentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditStudent extends EditRecord
{
    protected static string $resource = StudentResource::class;

    protected function getHeaderActions(): array
    {
        $actions = [];
        
        if (!$this->record->pkl_report) {
            $actions[] = Actions\DeleteAction::make();
        }

        return $actions;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
