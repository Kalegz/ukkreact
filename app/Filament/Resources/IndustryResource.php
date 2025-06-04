<?php

namespace App\Filament\Resources;

use App\Filament\Resources\IndustryResource\Pages;
use App\Filament\Resources\IndustryResource\RelationManagers;
use App\Models\Industry;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class IndustryResource extends Resource
{
    protected static ?string $model = Industry::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office';

    protected static ?string $navigationGroup = 'Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Industry Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('business_field')
                            ->required()
                            ->maxLength(255)
                            ->label('Business Field'),
                    ])->columns(2),
                
                Forms\Components\Section::make('Contact Information')
                    ->schema([
                        Forms\Components\TextInput::make('address')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('contact')
                            ->required()
                            ->maxLength(255)
                            ->label('Contact Person'),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('website')
                            ->url()
                            ->maxLength(255)
                            ->prefix('https://'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('business_field')
                    ->searchable()
                    ->sortable()
                    ->label('Business Field'),
                Tables\Columns\TextColumn::make('contact')
                    ->searchable()
                    ->sortable()
                    ->label('Contact Person'),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('business_field')
                    ->options(
                        Industry::query()
                            ->distinct()
                            ->pluck('business_field', 'business_field')
                            ->toArray()
                    )
                    ->label('Filter by Business Field'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListIndustries::route('/'),
            'create' => Pages\CreateIndustry::route('/create'),
            'edit' => Pages\EditIndustry::route('/{record}/edit'),
        ];
    }
}