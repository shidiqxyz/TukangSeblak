function hitungLuas() {
    // Mengambil nilai dari input dengan id "nilaiSisi"
    let nilaiSisi = parseFloat(document.getElementById("nilaiSisi").value);

    // Menghitung luas persegi
    let luas = nilaiSisi * nilaiSisi;

    // Menampilkan hasil di dalam elemen dengan id "hasil"
    document.getElementById("rumus").innerHTML = "L = S X S";
    document.getElementById("perhitungan").innerHTML = "L = " + nilaiSisi + " X " + nilaiSisi;
    document.getElementById("hasil").innerHTML = "L = " + luas;
}

function resetNilai() {
    document.getElementById("nilaiSisi").value = "";
    document.getElementById("rumus").innerHTML = "";
    document.getElementById("perhitungan").innerHTML = "";
    document.getElementById("hasil").innerHTML = ""; 
}

function hitungKeliling() {
    let sisi = parseFloat(document.getElementById("sisiInput").value);

    let keliling = 4 * sisi;

    document.getElementById("rumus-keliling").innerHTML = "K = S X 4";
    document.getElementById("perhitungan-keliling").innerHTML = "K = " + sisi + " X " + sisi;
    document.getElementById("hasilKeliling").innerHTML = "K =  " + keliling;
}

function resetForm() {
    
    document.getElementById("sisiInput").value = "";
    document.getElementById("perhitungan-keliling").innerHTML = "";
    document.getElementById("rumus-keliling").innerHTML = "";
    document.getElementById("hasilKeliling").innerHTML = "";
}