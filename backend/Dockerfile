FROM php:8.2-cli

# Install system dependencies and PHP extensions required for Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy the Laravel application files
# The context is ./backend, so ./backend/ refers to the nested Laravel app directory
COPY ./backend/ /app/

# Install application dependencies
RUN composer install --no-interaction --optimize-autoloader

# Ensure .env exists for key generation
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Generate application key
RUN php artisan key:generate

# Clear any existing bootstrap cache files
RUN rm -f bootstrap/cache/*.php

# Expose port
EXPOSE 8000

# Start Laravel development server, clearing cache first
CMD php artisan config:clear && php artisan package:discover && php artisan serve --host=0.0.0.0 --port=8000
