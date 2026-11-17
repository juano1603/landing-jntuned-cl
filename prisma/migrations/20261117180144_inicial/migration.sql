-- CreateEnum
CREATE TYPE "CategoriaProducto" AS ENUM ('ECU_FUELTECH', 'MODULO_FUELTECH', 'WIDEBAND', 'WASTEGATE', 'TURBO', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoProducto" AS ENUM ('DISPONIBLE', 'A_PEDIDO', 'AGOTADO');

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "categoria" "CategoriaProducto" NOT NULL,
    "resumen" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" INTEGER,
    "precioAnterior" INTEGER,
    "estado" "EstadoProducto" NOT NULL DEFAULT 'DISPONIBLE',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "nuevo" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "seoTitulo" TEXT,
    "seoDescripcion" TEXT,
    "palabrasClave" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto_imagenes" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "producto_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoLogin" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productos_slug_key" ON "productos"("slug");

-- CreateIndex
CREATE INDEX "productos_categoria_estado_idx" ON "productos"("categoria", "estado");

-- CreateIndex
CREATE INDEX "productos_destacado_orden_idx" ON "productos"("destacado", "orden");

-- CreateIndex
CREATE INDEX "producto_imagenes_productoId_orden_idx" ON "producto_imagenes"("productoId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "producto_imagenes" ADD CONSTRAINT "producto_imagenes_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
