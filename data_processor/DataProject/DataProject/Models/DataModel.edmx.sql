
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 11/24/2015 19:19:26
-- Generated from EDMX file: D:\Projects\CS-424-Project-3\data_processor\DataProject\DataProject\Models\DataModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [CS424];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_ArtistActiveYear]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ActiveYears] DROP CONSTRAINT [FK_ArtistActiveYear];
GO
IF OBJECT_ID(N'[dbo].[FK_ArtistAlbum]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Albums] DROP CONSTRAINT [FK_ArtistAlbum];
GO
IF OBJECT_ID(N'[dbo].[FK_ArtistGenreGenre]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ArtistGenres] DROP CONSTRAINT [FK_ArtistGenreGenre];
GO
IF OBJECT_ID(N'[dbo].[FK_ArtistGenreArtist]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ArtistGenres] DROP CONSTRAINT [FK_ArtistGenreArtist];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Genres]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Genres];
GO
IF OBJECT_ID(N'[dbo].[Albums]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Albums];
GO
IF OBJECT_ID(N'[dbo].[ActiveYears]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ActiveYears];
GO
IF OBJECT_ID(N'[dbo].[Artists]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Artists];
GO
IF OBJECT_ID(N'[dbo].[ArtistGenres]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ArtistGenres];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Genres'
CREATE TABLE [dbo].[Genres] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [GenreName] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Albums'
CREATE TABLE [dbo].[Albums] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [AlbumID] nvarchar(max)  NULL,
    [AlbumName] nvarchar(max)  NULL,
    [AlbumReleaseDate] int  NULL,
    [AlbumRating] float  NULL,
    [ArtistId] int  NOT NULL
);
GO

-- Creating table 'ActiveYears'
CREATE TABLE [dbo].[ActiveYears] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Start] int  NOT NULL,
    [End] int  NOT NULL,
    [ArtistId] int  NOT NULL
);
GO

-- Creating table 'Artists'
CREATE TABLE [dbo].[Artists] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [EchonestID] nvarchar(max)  NULL,
    [SpotifyID] nvarchar(max)  NULL,
    [ArtistName] nvarchar(max)  NULL,
    [ArtistImageURL] nvarchar(max)  NULL,
    [ArtistLocation] nvarchar(max)  NULL
);
GO

-- Creating table 'ArtistGenres'
CREATE TABLE [dbo].[ArtistGenres] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Weight] float  NOT NULL,
    [Frequency] float  NOT NULL,
    [Genre_Id] int  NOT NULL,
    [Artist_Id] int  NOT NULL
);
GO

-- Creating table 'ArtistPopularities'
CREATE TABLE [dbo].[ArtistPopularities] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Year] int  NOT NULL,
    [Popularity] float  NOT NULL,
    [Artist_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Genres'
ALTER TABLE [dbo].[Genres]
ADD CONSTRAINT [PK_Genres]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Albums'
ALTER TABLE [dbo].[Albums]
ADD CONSTRAINT [PK_Albums]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ActiveYears'
ALTER TABLE [dbo].[ActiveYears]
ADD CONSTRAINT [PK_ActiveYears]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Artists'
ALTER TABLE [dbo].[Artists]
ADD CONSTRAINT [PK_Artists]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ArtistGenres'
ALTER TABLE [dbo].[ArtistGenres]
ADD CONSTRAINT [PK_ArtistGenres]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ArtistPopularities'
ALTER TABLE [dbo].[ArtistPopularities]
ADD CONSTRAINT [PK_ArtistPopularities]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [ArtistId] in table 'ActiveYears'
ALTER TABLE [dbo].[ActiveYears]
ADD CONSTRAINT [FK_ArtistActiveYear]
    FOREIGN KEY ([ArtistId])
    REFERENCES [dbo].[Artists]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ArtistActiveYear'
CREATE INDEX [IX_FK_ArtistActiveYear]
ON [dbo].[ActiveYears]
    ([ArtistId]);
GO

-- Creating foreign key on [ArtistId] in table 'Albums'
ALTER TABLE [dbo].[Albums]
ADD CONSTRAINT [FK_ArtistAlbum]
    FOREIGN KEY ([ArtistId])
    REFERENCES [dbo].[Artists]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ArtistAlbum'
CREATE INDEX [IX_FK_ArtistAlbum]
ON [dbo].[Albums]
    ([ArtistId]);
GO

-- Creating foreign key on [Genre_Id] in table 'ArtistGenres'
ALTER TABLE [dbo].[ArtistGenres]
ADD CONSTRAINT [FK_ArtistGenreGenre]
    FOREIGN KEY ([Genre_Id])
    REFERENCES [dbo].[Genres]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ArtistGenreGenre'
CREATE INDEX [IX_FK_ArtistGenreGenre]
ON [dbo].[ArtistGenres]
    ([Genre_Id]);
GO

-- Creating foreign key on [Artist_Id] in table 'ArtistGenres'
ALTER TABLE [dbo].[ArtistGenres]
ADD CONSTRAINT [FK_ArtistGenreArtist]
    FOREIGN KEY ([Artist_Id])
    REFERENCES [dbo].[Artists]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ArtistGenreArtist'
CREATE INDEX [IX_FK_ArtistGenreArtist]
ON [dbo].[ArtistGenres]
    ([Artist_Id]);
GO

-- Creating foreign key on [Artist_Id] in table 'ArtistPopularities'
ALTER TABLE [dbo].[ArtistPopularities]
ADD CONSTRAINT [FK_ArtistPopularityArtist]
    FOREIGN KEY ([Artist_Id])
    REFERENCES [dbo].[Artists]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ArtistPopularityArtist'
CREATE INDEX [IX_FK_ArtistPopularityArtist]
ON [dbo].[ArtistPopularities]
    ([Artist_Id]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------