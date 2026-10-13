import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useGetFetch } from "../../hooks/useGetFetch";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = () => {
  const { data: pedidos = [], loading, error } = useGetFetch("/pedidos");
  const meses = Array.from({ length: 6 }, (_, index) => {
    const fecha = new Date();
    fecha.setDate(1);
    fecha.setHours(0, 0, 0, 0);
    fecha.setMonth(fecha.getMonth() - 5 + index);

    return {
      year: fecha.getFullYear(),
      month: fecha.getMonth(),
      label: fecha.toLocaleDateString("es-VE", {
        month: "short",
        year: "2-digit",
      }),
    };
  });
  const ventasPorMes = new Map(
    meses.map(({ year, month }) => [`${year}-${month}`, 0])
  );

  pedidos.forEach((pedido) => {
    const tienePagoVerificado = pedido.Pagos?.some(
      (pago) => pago.Estados_pago?.nombre === "Verificado"
    );
    const fecha = new Date(pedido.fecha);
    const total = Number(pedido.total);

    if (!tienePagoVerificado || Number.isNaN(fecha.getTime()) || !Number.isFinite(total)) {
      return;
    }

    const claveMes = `${fecha.getFullYear()}-${fecha.getMonth()}`;

    if (ventasPorMes.has(claveMes)) {
      ventasPorMes.set(claveMes, ventasPorMes.get(claveMes) + total);
    }
  });

  const ventas = meses.map(({ year, month }) => ventasPorMes.get(`${year}-${month}`));
  const hayVentas = ventas.some((venta) => venta > 0);
  const data = {
    labels: meses.map(({ label }) => label),

    datasets: [
      {
        label: "Ventas web ($)",
        data: ventas,

        borderColor: "#17195A",

        backgroundColor: "rgba(229,184,63,.18)",

        fill: true,

        tension: 0.35,

        pointBackgroundColor: "#E5B83F",

        pointBorderColor: "#17195A",

        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: true,
        text: "Ventas web de los últimos 6 meses",
        font: {
          size: 18,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$ ${Number(value).toLocaleString("es-VE")}`,
        },
        grid: {
          color: "#ececec",
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="card dashboard-chart">

      <div className="card-body">
        <div
          style={{
            height: "350px",
          }}
        >
          {loading ? (
            <p role="status">Cargando ventas...</p>
          ) : error ? (
            <p role="alert">No se pudieron cargar las ventas.</p>
          ) : (
            <>
              <Line data={data} options={options} />
              {!hayVentas && (
                <p className="text-center text-muted mt-2">
                  No hay ventas web verificadas en los últimos 6 meses.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;