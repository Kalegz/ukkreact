<?php

namespace App\Filament\Resources;

use Filament\Forms;
use Filament\Tables;
use App\Models\Student;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\StudentResource\Pages;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\StudentResource\RelationManagers;

class StudentResource extends Resource
{
    protected static ?string $model = Student::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationGroup = 'Management';

    protected static ?string $modelLabel = 'Student';

    protected static ?string $pluralModelLabel = 'Students';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Student Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('nis')
                            ->label('NIS')
                            ->required()
                            ->maxLength(255),
                            
                        Forms\Components\Select::make('gender')
                            ->required()
                            ->options([
                                'L' => 'Laki-laki',
                                'P' => 'Perempuan',
                            ])
                            ->native(false),
                            
                        Forms\Components\TextInput::make('address')
                            ->required()
                            ->maxLength(255),
                            
                        Forms\Components\TextInput::make('contact')
                            ->required()
                            ->maxLength(255),
                            
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                            
                        Forms\Components\FileUpload::make('photo')
                            ->image()
                            ->directory('student-photos')
                            ->nullable(),
                            
                        // Forms\Components\Select::make('pkl_report')
                        //     ->label('PKL Report')
                        //     ->options([
                        //         '0' => 'Nope',
                        //         '1' => 'Done',
                        //     ])
                        //     ->default('0')
                        //     ->native(false),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('nis')
                    ->sortable()
                    ->label('NIS')
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('gender_display')
                    ->label('Gender')
                    ->getStateUsing(function (Student $record): string {
                        return DB::selectOne('SELECT get_gender_display(?) as gender_display', [$record->gender])?->gender_display ?? 'Unknown';
                    })
                    ->sortable(query: function (Builder $query, string $direction): Builder {
                        return $query->orderByRaw('get_gender_display(gender) ' . $direction);
                    }),
                    
                Tables\Columns\TextColumn::make('email'),
                    
                Tables\Columns\TextColumn::make('contact'),
                    
                Tables\Columns\ImageColumn::make('photo')
                    ->circular()
                    ->defaultImageUrl(url('/images/default-avatar.png')),
                    
                Tables\Columns\TextColumn::make('pkl_report_status')
                    ->label('PKL Report')
                    ->getStateUsing(function (Student $record): string {
                        return $record->pkl_report === '1' ? 'Done' : 'Nope';
                    })
                    ->badge()
                    ->color(fn (string $state): string => $state === 'Done' ? 'success' : 'danger'),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('gender')
                    ->options([
                        'Laki-laki' => 'Laki-laki',
                        'Perempuan' => 'Perempuan',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkAction::make('deleteSelected')
                    ->label('Hapus yang Belum PKL')
                    ->requiresConfirmation()
                    ->action(function (Collection $records) {
                        $recordsToDelete = $records->filter(function ($record) {
                            return !$record->pkl_report;
                        });

                        $recordsToDelete->each->delete();
                    })
                    ->deselectRecordsAfterCompletion()
                    ->color('danger')
                    ->icon('heroicon-o-trash'),
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
            'index' => Pages\ListStudents::route('/'),
            'create' => Pages\CreateStudent::route('/create'),
            'edit' => Pages\EditStudent::route('/{record}/edit'),
        ];
    }
}