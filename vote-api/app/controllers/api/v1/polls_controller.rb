class Api::V1::PollsController < ApplicationController
  def index
    render json: Poll.all, include: :votes
  end

  def show
    poll = Poll.find(params[:id])
    render json: poll, include: :votes
  end

  def create
    poll = Poll.new(poll_params)

    if poll.save
      render json: poll, status: :created
    else
      render json: poll.errors, status: :unprocessable_entity
    end
  end

  def update
    poll = Poll.find(params[:id])
    if poll.update(poll_params)
      render json: poll
    else
      render json: poll.errors, status: :unprocessable_entity
    end
  end

  private

  def poll_params
    params.require(:poll).permit(:title, options: [])
  end
end
