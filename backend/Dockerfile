FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY ./backend/ /app/

ENV COMPOSER_PROCESS_TIMEOUT=2000

RUN composer install --no-interaction --optimize-autoloader --prefer-dist --no-progress

EXPOSE 8000

CMD sh -c "cp .env.example .env || true && php artisan key:generate || true && php artisan serve --host=0.0.0.0 --port=8000"