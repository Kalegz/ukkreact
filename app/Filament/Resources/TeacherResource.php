<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TeacherResource\Pages;
use App\Filament\Resources\TeacherResource\RelationManagers;
use App\Models\Teacher;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TeacherResource extends Resource
{
    protected static ?string $model = Teacher::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';

    protected static ?string $navigationGroup = 'Management';

    protected static ?string $modelLabel = 'Teacher';

    protected static ?string $pluralModelLabel = 'Teachers';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Teacher Information')
                    ->schema([                        
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(2),
                            
                        Forms\Components\Textarea::make('address')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        
                        Forms\Components\TextInput::make('contact')
                            ->required()
                            ->maxLength(255)
                            ->label('Contact Number'),
                            
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255),

                        Forms\Components\FileUpload::make('photo')
                            ->image()
                            ->directory('teachers')
                            ->columnSpanFull()
                            ->imageEditor(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([                    
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('address')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('contact')
                    ->searchable()
                    ->sortable()
                    ->label('Contact'), 

                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\ImageColumn::make('photo')
                    ->label('Photo')
                    ->circular()
                    ->toggleable(),
            ])
            ->filters([
                // You can add filters here if needed
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateActions([
                Tables\Actions\CreateAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            // Add any relations here if needed
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTeachers::route('/'),
            'create' => Pages\CreateTeacher::route('/create'),
            'edit' => Pages\EditTeacher::route('/{record}/edit'),
        ];
    }
}