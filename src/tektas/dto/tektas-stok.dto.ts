import { ApiProperty } from '@nestjs/swagger';

export class TektasStokDto {
  @ApiProperty()
  ID: number;

  @ApiProperty()
  KODU: string;

  @ApiProperty()
  STOK: string;

  @ApiProperty()
  DURUM: string;

  @ApiProperty()
  OEM_KODU: string;

  @ApiProperty()
  RESIM: string | null;

  @ApiProperty()
  BARKOD: string;

  @ApiProperty()
  FIYAT: string | null;

  @ApiProperty()
  KATEGORI_ID: number;

  @ApiProperty()
  PARCA_MARKA_ID: number;

  @ApiProperty()
  PARCA_MARKA: string;

  @ApiProperty()
  ACIKLAMA: string;

  @ApiProperty()
  GENEL_ACIKLAMA: string;

  @ApiProperty()
  ALIS_FIYAT: string;

  @ApiProperty()
  SATIS_FIYAT: string;

  @ApiProperty()
  ADET: number;

  @ApiProperty()
  KALAN_ADET: string;

  @ApiProperty()
  MARKA: string;

  @ApiProperty()
  KATEGORI: string;

  @ApiProperty()
  RAF: string;

  @ApiProperty()
  RAF_YER: string;
}

export class TektasStokResponseDto {
  @ApiProperty()
  HATA: boolean;

  @ApiProperty()
  ACIKLAMA: string;

  @ApiProperty()
  TOPLAM_KAYIT: number;

  @ApiProperty({ type: [TektasStokDto] })
  DATA: TektasStokDto[];
}
