import matplotlib.pyplot as plt
import matplotlib.ticker as ticker


def forecast_revenue_with_side_by_side_charts(
    cost_per_second, average_inference_time, credits, price,
    users, n, regular_users_percentage, growth_rate,
    operational_costs_per_month, months=12):
    """
    Function to calculate and forecast the revenue, profit, and number of users based on user-defined schema over a given number of months.
    Plots revenue and profit on one chart, and users on a separate chart, side by side.
    """
    # Initial calculations
    cost_per_inference = average_inference_time * cost_per_second
    cost = credits * cost_per_inference

    regular_users = users * regular_users_percentage

    monthly_revenue_regular_users = regular_users * price * n
    monthly_cost_regular_users = regular_users * cost * n
    monthly_profit_regular_users = monthly_revenue_regular_users - monthly_cost_regular_users

    # Initialize lists to store the forecasted values
    forecasted_revenue = []
    forecasted_profit = []
    forecasted_users = []

    # Forecast over the specified number of months
    for month in range(1, months + 1):
        # Apply growth rate to users
        users =  users + users * growth_rate
        regular_users =  users * regular_users_percentage
        
        # Monthly revenue and cost with updated regular users
        monthly_revenue_regular_users = regular_users * price * n
        monthly_cost_regular_users = regular_users * cost_per_inference * n
        monthly_profit_regular_users = monthly_revenue_regular_users - monthly_cost_regular_users
        
        # Subtract operational costs and taxes
        monthly_net_profit = monthly_profit_regular_users - operational_costs_per_month
        
        # Store the forecasted values
        forecasted_revenue.append(monthly_revenue_regular_users)
        forecasted_profit.append(monthly_net_profit)
        forecasted_users.append(users)

    # Plotting the revenue, profit, and users forecast side by side
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

    # Plot revenue and profit on the first chart
    ax1.plot(range(1, months + 1), forecasted_revenue, marker='o', linestyle='-', color='b', label='Revenue')
    ax1.plot(range(1, months + 1), forecasted_profit, marker='x', linestyle='--', color='g', label='Profit')
    ax1.set_xlabel('Month')
    ax1.set_ylabel('Amount (in USD/month)')
    ax1.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, _: f'${x:,.0f}'))
    ax1.legend(loc='upper left')
    ax1.grid(True)
    ax1.set_title('Monthly Revenue and Profit Forecast')

    # Plot number of users on the second chart
    ax2.plot(range(1, months + 1), forecasted_users, marker='s', linestyle='-', color='r', label='Users')
    ax2.set_xlabel('Month')
    ax2.set_ylabel('Number of Users')
    ax2.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, _: f'{x:,.0f}'))
    ax2.legend(loc='upper left')
    ax2.grid(True)
    ax2.set_title('User Forecast')

    plt.suptitle('Monthly Revenue/Profit and User Forecasts')
    plt.tight_layout()
    plt.show()

# Parameters
cost_per_second = 0.000725
average_inference_time = 4.5
credits = 100
price = 5
users = 1
n = 2  # Number of times regular users buy per month
regular_users_percentage = 0.10
growth_rate = 0.25
operational_costs_per_month = 20 

forecast_revenue_with_side_by_side_charts(
    cost_per_second, average_inference_time, credits, price,
    users, n, regular_users_percentage, growth_rate,
    operational_costs_per_month, months=36)
