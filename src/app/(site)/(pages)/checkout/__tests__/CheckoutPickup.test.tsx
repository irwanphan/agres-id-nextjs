// test case 1:
// input data di billing section
// -- test awal tanpa mengubah data, ambil langsung dari data user: data billing address dan user login
// input data di shipping section
// -- test dengan mmemilih pickup "Diambil sendiri (pickup) di gerai AGRES"
// -- pilih kota Pontianak
// -- pilih Pickup Point "164. AGRES ID & FONE - JL. HIJAS NO 14 ......."
// input catatn di order section
// -- data shipping address dan price muncul di order section
// input data di payment method, coba dengan "manual" method
// klik tombol bayar
// muncul halaman /success?amount="nilai amount barangnya"
// klik tombol Link "Account" ke /my-account/orders
// -- muncul halaman /my-account/orders
// -- muncul data order yang baru saja dipesan

// test case 2:
// input data di billing section
// -- test awal tanpa mengubah data, ambil langsung dari data user: data billing address dan user login
// input data di shipping section
// -- test dengan mmemilih pickup "Diambil sendiri (pickup) di gerai AGRES"
// -- pilih kota Pontianak
// -- pilih Pickup Point "164. AGRES ID & FONE - JL. HIJAS NO 14 ......."
// input catatn di order section
// -- data shipping address dan price muncul di order section
// input data di payment method, coba dengan "bank_transfer" method
// -- pilih bank "Mandiri"
// klik tombol bayar
// muncul halaman /success?amount="nilai amount barangnya"
// klik tombol Link "Account" ke /my-account/orders
// -- muncul halaman /my-account/orders
// -- muncul data order yang baru saja dipesan
// Coba ulang dengan memilih bank yang berbeda