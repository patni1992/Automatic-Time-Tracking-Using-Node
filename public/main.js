(() => {
  const formatName = (value, row) =>
    row.url ? `<a target="_blank" href="${row.url}">${value}</a>` : value;
  const formatTime = (value) => secondsToHms(value);
  const secondsToHms = (d) => {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = s > 0 ? s + (s === 1 ? " second " : " seconds") : "";

    return hDisplay + mDisplay + sDisplay;
  };

  const dynamicColors = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return `rgba(${r},${g},${b},0.5)`;
  };

  const poolColors = (size) => {
    const pool = [];

    for (let i = 0; i < size; i++) {
      pool.push(dynamicColors());
    }
    return pool;
  };

  const columns = [
    {
      field: "name",
      title: "name",
      formatter: formatName,
      sortable: true,
    },
    {
      field: "time",
      title: "time",
      formatter: formatTime,
      sortable: true,
    },
  ];

  const chartData = JSON.parse(decodedJson);
  const ctx = document.getElementById("chart").getContext("2d");

  const renderTableData = (chart, columns) => {
    const table = $("#table");

    $("#table-title").text(`${chart.title} (${secondsToHms(chart.total)})`);

    if (table.children().length) {
      return table.bootstrapTable("load", chart.data);
    }

    table.bootstrapTable({
      columns,
      data: chart.data,
    });
  };

  const graphClickEvent = (event, array) => {
    if (!array.length) {
      return;
    }
    renderTableData(chartData[array[0]._index], columns);
  };

  new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: chartData.map((data) => data.total),
          backgroundColor: poolColors(chartData.length),
        },
      ],
      labels: chartData.map((chart) => chart.title),
    },
    options: {
      onClick: graphClickEvent,
    },
  });
})();
